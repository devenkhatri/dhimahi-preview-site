import { NextRequest, NextResponse } from 'next/server';
import { searchContent, type SearchResult } from '@/lib/search';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const typeParam = searchParams.get('type');

        // Validate the type parameter
        const validTypes = ['service', 'insight', 'persona', 'case-study', 'resource', 'about'] as const;
        type ValidType = typeof validTypes[number];
        const contentType: ValidType | undefined =
            typeParam && validTypes.includes(typeParam as ValidType)
                ? (typeParam as ValidType)
                : undefined;

        const results = searchContent(query, contentType);

        return NextResponse.json({
            results,
            total: results.length,
            query,
        });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'An error occurred while searching. Please try again.', results: [], total: 0 },
            { status: 500 }
        );
    }
}
