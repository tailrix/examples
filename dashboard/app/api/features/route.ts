// app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFeatures } from 'tailrix';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const accountId = searchParams.get('accountId');
        const orgId = searchParams.get('orgId');
        const isCustomerId = searchParams.get('isCustomerId');


        const features = await getFeatures(accountId || '',
            orgId || '',
            isCustomerId === 'true'
        )

        console.log('Fetched features:', features);
        return NextResponse.json(features);
    } catch (err) {
        console.error('Error fetching features:', err);
        return NextResponse.json(err);
    }
}
