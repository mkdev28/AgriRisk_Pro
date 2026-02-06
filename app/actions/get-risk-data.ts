'use server';

import { getRealWeatherForecast } from '@/lib/data/weather-api';
// import { getRealSatelliteData } from '@/lib/data/satellite-api'; // Optional, if we want NDVI

export interface EnvironmentalRiskData {
    rainfall_deficit: number;
    heatwave_days: number;
    monsoon_reliability: number;
    // ndvi: number; 
}

export async function getEnvironmentalRiskData(lat: number, lng: number): Promise<EnvironmentalRiskData> {
    try {
        // Parallel fetch for potential performance (though we only have weather active now?)
        // const [weather, satellite] = await Promise.all([
        //   getRealWeatherForecast(lat, lng),
        //   getRealSatelliteData(lat, lng)
        // ]);

        // For now, let's just use weather as specifically requested for monsoon/rainfall
        const weather = await getRealWeatherForecast(lat, lng);

        return {
            rainfall_deficit: (weather.risks.drought_probability || 0) * 100, // Convert probability to deficit-like score for risk calc
            heatwave_days: weather.risks.heatwave_days || 0,
            monsoon_reliability: 1 - (weather.risks.drought_probability || 0),
        };
    } catch (error) {
        console.error('Error fetching environmental data:', error);
        // Fallback to safe defaults if API fails
        return {
            rainfall_deficit: 0,
            heatwave_days: 0,
            monsoon_reliability: 1
        };
    }
}
