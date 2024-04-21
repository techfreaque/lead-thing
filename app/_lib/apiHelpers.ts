import { NextResponse } from 'next/server';

export function ApiResponse(message: string, status: number = 200): NextResponse {
    return new NextResponse(message, {
        status,
    });
}

export function formatApiCallDetails(fields: { [key: string]: string | undefined; }): string {
    const data = (Object.entries(fields) as [string, string][])
        .filter(([, value]) => value).map(([name, value]) =>
            ` ${name}: ${value}`
        );
    return `- Contact:${data}`;
}

export async function handleResponse(response: Response): Promise<{
    jsonResponse: any;
    success: boolean;
}> {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            success: response.ok,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}
