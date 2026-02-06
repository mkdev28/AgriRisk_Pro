import { NextRequest, NextResponse } from 'next/server';
import { getKCCData } from '@/lib/data/mock-kcc';
import { getRealSatelliteData } from '@/lib/data/satellite-api';
import { getRealWeatherForecast } from '@/lib/data/weather-api';
import { getMockSatelliteData, getMockWeatherForecast } from '@/lib/data/mock-satellite';
import { calculatePremium } from '@/lib/ml/risk-calculator';
import { detectFraud } from '@/lib/ml/fraud-detector';
import { AssessmentRequest, AssessmentResponse, Suggestion } from '@/types';
import { mlClient, MLPredictionInput } from '@/lib/ml/ml-client';

// Helper function to generate detailed, farm-specific improvement suggestions
function generateDetailedSuggestions(params: {
    current_risk_score: number;
    breakdown: { weather_risk: number; infrastructure: number; diversification: number; financial_health: number };
    irrigation_type: string;
    crop_count: number;
    has_canal_access: boolean;
    land_acres: number;
    owns_tractor: boolean;
    has_storage: boolean;
    has_livestock: boolean;
    current_premium: number;
}): Suggestion[] {
    const suggestions: Suggestion[] = [];
    let priority = 1;

    // Irrigation improvement (if rainfed or non-drip)
    if (params.irrigation_type === 'rainfed' || params.irrigation_type === 'flood') {
        const score_increase = 15;
        const new_score = Math.min(100, params.current_risk_score + score_increase);
        const premium_savings = Math.round((params.current_premium * score_increase) / 50); // ~15% reduction
        const cost_per_acre = 35000;
        const estimated_cost = Math.round(params.land_acres * cost_per_acre);

        suggestions.push({
            action: 'Install Drip Irrigation',
            description: `Upgrade from ${params.irrigation_type} to drip irrigation. Reduces water usage by 40-60% and improves yield consistency even during drought.`,
            impact: 'high' as const,
            score_increase,
            premium_savings,
            estimated_cost,
            govt_subsidy_available: true,
            subsidy_percent: 45,
            priority_rank: priority++
        });
    }

    // Crop diversification (if single crop)
    if (params.crop_count === 1) {
        const score_increase = 12;
        const premium_savings = Math.round((params.current_premium * score_increase) / 50);
        const estimated_cost = Math.round(params.land_acres * 8000); // Seed + preparation

        suggestions.push({
            action: 'Crop Diversification',
            description: `Currently growing only 1 crop. Adding 1-2 more crops (intercropping or rotation) reduces total failure risk by 60% and stabilizes income.`,
            impact: 'high' as const,
            score_increase,
            premium_savings,
            estimated_cost,
            govt_subsidy_available: true,
            subsidy_percent: 25,
            priority_rank: priority++
        });
    } else if (params.crop_count === 2) {
        suggestions.push({
            action: 'Add One More Crop Variety',
            description: `Growing ${params.crop_count} crops. Adding one more increases resilience further.`,
            impact: 'medium' as const,
            score_increase: 6,
            premium_savings: Math.round((params.current_premium * 6) / 50),
            estimated_cost: Math.round(params.land_acres * 5000),
            govt_subsidy_available: false,
            subsidy_percent: 0,
            priority_rank: priority++
        });
    }

    // Livestock integration (if none)
    if (!params.has_livestock && params.land_acres >= 3) {
        suggestions.push({
            action: 'Integrate Livestock (Dairy/Poultry)',
            description: 'Adds alternative income source, reduces dependency on crop sales alone. Manure improves soil fertility.',
            impact: 'medium' as const,
            score_increase: 8,
            premium_savings: Math.round((params.current_premium * 8) / 50),
            estimated_cost: 45000,
            govt_subsidy_available: true,
            subsidy_percent: 33,
            priority_rank: priority++
        });
    }

    // Storage facility (if none and land >= 5 acres)
    if (!params.has_storage && params.land_acres >= 5) {
        suggestions.push({
            action: 'Build Storage Facility',
            description: 'Enables selling produce at better prices by avoiding distress sales during harvest glut. Protects from post-harvest losses (20-30%).',
            impact: 'medium' as const,
            score_increase: 7,
            premium_savings: Math.round((params.current_premium * 7) / 50),
            estimated_cost: 80000,
            govt_subsidy_available: true,
            subsidy_percent: 50,
            priority_rank: priority++
        });
    }

    // Soil testing (always beneficial)
    suggestions.push({
        action: 'Get Soil Health Card',
        description: 'Free government service. Optimizes fertilizer usage, can increase yield by 10-15% and reduce input costs by ₹5,000-8,000/acre.',
        impact: 'low' as const,
        score_increase: 5,
        premium_savings: Math.round((params.current_premium * 5) / 50),
        estimated_cost: 0, // Free government service
        govt_subsidy_available: true,
        subsidy_percent: 100,
        priority_rank: priority++
    });

    // Water source improvement (if no canal and land >= 4 acres)
    if (!params.has_canal_access && params.land_acres >= 4) {
        suggestions.push({
            action: 'Construct Farm Pond',
            description: 'Rainwater harvesting structure. Stores 50,000-1,00,000 liters, provides irrigation for 2-3 critical months.',
            impact: 'medium' as const,
            score_increase: 10,
            premium_savings: Math.round((params.current_premium * 10) / 50),
            estimated_cost: 120000,
            govt_subsidy_available: true,
            subsidy_percent: 60,
            priority_rank: priority++
        });
    }

    // Sort by priority and return top 4
    return suggestions
        .sort((a, b) => a.priority_rank - b.priority_rank)
        .slice(0, 4);
}


export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        const body: AssessmentRequest = await req.json();
        const {
            kcc_id,
            crop_type,
            season,
            gps_latitude,
            gps_longitude,
            irrigation_type,
            borewell_count = 0,
            borewell_depth_ft = 0,
            has_canal_access = false,
            owns_tractor = false,
            has_storage = false,
            livestock_count = 0,
            sum_insured = 200000
        } = body;

        // 1. Validation (Keep existing)
        if (!kcc_id || !crop_type || !season || !gps_latitude || !gps_longitude) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 2. Data Enrichment (Keep existing logic)
        // Fetch KCC data
        let kccData = getKCCData(kcc_id);

        if (!kccData) {
            return NextResponse.json(
                { success: false, error: 'KCC ID not found' },
                { status: 404 }
            );
        }


        // Fetch satellite & weather data with fallback
        let satelliteData;
        let weatherData;
        let usedMockData = false;

        try {
            satelliteData = await getRealSatelliteData(gps_latitude, gps_longitude);
            console.log('✅ Using real satellite data from NASA POWER');
        } catch (error) {
            console.warn('⚠️ NASA POWER API failed, using mock satellite data:', error instanceof Error ? error.message : 'Unknown error');
            satelliteData = getMockSatelliteData(gps_latitude, gps_longitude);
            usedMockData = true;
        }

        try {
            weatherData = await getRealWeatherForecast(gps_latitude, gps_longitude);
            console.log('✅ Using real weather data from OpenWeather');
        } catch (error) {
            console.warn('⚠️ OpenWeather API failed, using mock weather data:', error instanceof Error ? error.message : 'Unknown error');
            weatherData = getMockWeatherForecast(gps_latitude, gps_longitude);
            usedMockData = true;
        }

        // 3. Prepare Input for Python Brain (The New Part)
        // We combine User Input + KCC Data + Satellite Data into one payload
        const mlInput: MLPredictionInput = {
            // User Inputs
            state: 'Maharashtra', // Default or derived from KCC
            crop_type: crop_type,
            season: season,
            irrigation_type: irrigation_type || 'rainfed',
            land_acres: kccData.land_acres, // Trust KCC over user input
            water_source_count: borewell_count + (has_canal_access ? 1 : 0),
            borewell_count: borewell_count,
            borewell_depth_ft: borewell_depth_ft,
            has_canal_access: has_canal_access,
            // Use KCC registered_crops count for diversity scoring
            crop_count: kccData.registered_crops.length,
            has_livestock: livestock_count > 0,
            livestock_count: livestock_count,
            owns_tractor: owns_tractor,
            has_storage: has_storage,

            // Enriched Financial Data (From KCC Mock)
            kcc_score: 750, // Mock score derived from repayment
            kcc_repayment_rate: kccData.repayment_rate_percent,
            outstanding_debt_ratio: kccData.outstanding_amount / (kccData.land_acres * 50000),
            has_insurance_history: false,

            // Enriched Environmental Data (From Satellite/Weather APIs)
            // Note: ML client auto-normalizes percentages >1 to decimal (e.g., 35 → 0.35)
            rainfall_deficit_pct: weatherData.risks.drought_probability * 100, // Map probability to deficit
            actual_rainfall_mm: 1000 * (1 - weatherData.risks.drought_probability), // Estimate
            heatwave_days: weatherData.risks.heatwave_days,
            monsoon_reliability: 1 - weatherData.risks.drought_probability,
            ndvi_score: satelliteData.ndvi,
            soil_moisture_percent: satelliteData.soil_moisture * 100,  // Convert 0.45 → 45%
            soil_fertility_index: 0.7, // Default
        };

        // 4. Calculate Risk (Call Python Brain instead of local function)
        // This replaces 'calculateRiskScore(...)'
        const prediction = await mlClient.predict(mlInput);

        // 5. Fraud Detection (Keep existing logic)
        const fraudCheck = detectFraud({
            farmer_input: {
                land_acres: kccData.land_acres,
                irrigation_type,
                crop_type
            },
            kcc_data: {
                land_acres: kccData.land_acres,
                village: kccData.village,
                district: kccData.district
            },
            satellite_data: {
                ndvi: satelliteData.ndvi,
                ndvi_uniformity: 0.7 + Math.random() * 0.2,
                soil_moisture: satelliteData.soil_moisture
            },
            nearby_farms: []
        });

        // 6. Pricing (using ML prediction score)
        const district_avg_premium = 5000;
        const pricing = calculatePremium(prediction.risk_score, sum_insured, district_avg_premium);

        // Extract water source count for reference
        const water_source_count = borewell_count + (has_canal_access ? 1 : 0);

        const processingTime = Date.now() - startTime;

        // Save fraud case if flags exist
        if (fraudCheck.flags.length > 0) {
            // Dynamically import to avoid circular dependencies if any, though likely safe to import at top
            const { saveFraudCase } = require('@/lib/fraud-service');

            saveFraudCase({
                id: `fraud_${Date.now()}`,
                kcc_id,
                farmer_name: kccData.farmer_name,
                phone: kccData.phone,
                severity: fraudCheck.recommendation === 'reject' ? 'critical' : fraudCheck.recommendation === 'field_verify' ? 'high' : 'medium',
                flags: fraudCheck.flags,
                assessment_date: new Date().toISOString().split('T')[0],
                fraud_score: fraudCheck.fraud_score
            });
        }

        const response: AssessmentResponse = {
            success: true,
            data: {
                farmer_id: `farmer_${kcc_id}`,
                farmer_name: kccData.farmer_name,
                assessment_id: `assess_${Date.now()}`,
                final_risk_score: prediction.risk_score,
                risk_category: prediction.risk_category as 'low' | 'medium' | 'high',
                confidence_level: prediction.confidence,
                scores: prediction.breakdown,
                recommended_premium: pricing.recommended_premium,
                district_avg_premium: pricing.district_avg_premium,
                savings_amount: pricing.savings,
                savings_percent: pricing.savings_percent,
                fraud_flags: fraudCheck.flags,
                requires_field_verification: fraudCheck.recommendation === 'field_verify',
                trust_score: 50 - fraudCheck.fraud_score / 2,

                // Frontend Helpers
                risk_factors: [
                    // Map top drivers from Python to your UI format
                    ...(prediction.top_risk_drivers || []).map(d => d.factor),
                    // Extract fraud flag descriptions as strings
                    ...fraudCheck.flags.map(f => f.details)
                ],
                improvement_suggestions: generateDetailedSuggestions({
                    current_risk_score: prediction.risk_score,
                    breakdown: prediction.breakdown,
                    irrigation_type: irrigation_type || 'rainfed',
                    crop_count: kccData.registered_crops.length,
                    has_canal_access,
                    land_acres: kccData.land_acres,
                    owns_tractor,
                    has_storage,
                    has_livestock: livestock_count > 0,
                    current_premium: pricing.recommended_premium
                }),


                data_sources: usedMockData
                    ? ['KCC Registry', 'Mock Satellite/Weather', 'CatBoost ML Engine']
                    : ['KCC Registry', 'NASA POWER', 'OpenWeather', 'CatBoost ML Engine'],
                processing_time_ms: processingTime
            }
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Assessment error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}