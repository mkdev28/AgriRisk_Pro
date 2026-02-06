import { NextRequest, NextResponse } from 'next/server';
import { mlClient } from '@/lib/ml/ml-client';

export async function GET(req: NextRequest) {
    try {
        const health = await mlClient.healthCheck();

        return NextResponse.json({
            ml_server: health.status,
            message: health.message,
            latency: health.latency,
            fallback_enabled: true,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            ml_server: 'error',
            message: 'Failed to check ML server health',
            error: error instanceof Error ? error.message : 'Unknown error',
            fallback_enabled: true,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
