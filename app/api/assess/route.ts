import { NextRequest, NextResponse } from 'next/server';
import { getKCCData } from '@/lib/data/mock-kcc';
//import { getMockSatelliteData, getMockWeatherForecast } from '@/lib/data/mock-satellite';
//import { getMockSatelliteData } from '@/lib/data/mock-satellite';
import { getRealSatelliteData } from '@/lib/data/satellite-api';
import { getRealWeatherForecast } from '@/lib/data/weather-api';
import { calculatePremium } from '@/lib/ml/risk-calculator';
import { detectFraud } from '@/lib/ml/fraud-detector';
import { AssessmentRequest, AssessmentResponse } from '@/types';
import { mlClient, MLPredictionInput } from '@/lib/ml/ml-client';

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


        // Fetch satellite data (mock)
        //const satelliteData = getMockSatelliteData(gps_latitude, gps_longitude);
        // Fetch weather forecast (mock)
        //const weatherData = await getMockWeatherForecast(gps_latitude, gps_longitude);
        // NEW:
        const satelliteData = await getRealSatelliteData(gps_latitude, gps_longitude);
        const weatherData = await getRealWeatherForecast(gps_latitude, gps_longitude);

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
            crop_count: 1, // Defaulting as we don't have full history
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
                improvement_suggestions: [
                    {
                        action: 'Install Drip Irrigation',
                        description: 'Reduces water dependency and improves resilience against drought.',
                        impact: 'high',
                        score_increase: 15,
                        premium_savings: 4500,
                        estimated_cost: 45000,
                        govt_subsidy_available: true,
                        subsidy_percent: 45,
                        priority_rank: 1
                    },
                    {
                        action: 'Crop Diversification',
                        description: 'Planting multiple crops reduces failure risk.',
                        impact: 'medium',
                        score_increase: 8,
                        premium_savings: 2200,
                        estimated_cost: 12000,
                        govt_subsidy_available: false,
                        subsidy_percent: 0,
                        priority_rank: 2
                    },
                    {
                        action: 'Soil Testing',
                        description: 'Optimize fertilizer usage based on soil health card.',
                        impact: 'low',
                        score_increase: 5,
                        premium_savings: 1500,
                        estimated_cost: 500,
                        govt_subsidy_available: true,
                        subsidy_percent: 100,
                        priority_rank: 3
                    }
                ],

                data_sources: ['KCC Registry', 'NASA Satellite', 'CatBoost ML Engine'],
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