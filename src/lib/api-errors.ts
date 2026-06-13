import { NextResponse } from 'next/server';
import { z } from 'zod';

export function handleApiError(error: unknown, context: string) {
  console.error(`[API_ERROR] [${context}]`, error);

  if (error instanceof z.ZodError) {
    return NextResponse.json({ 
      success: false,
      message: 'Validation failed', 
      errors: error.errors 
    }, { status: 400 });
  }

  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      return NextResponse.json({ success: false, message: error.message }, { status: 404 });
    }
    if (error.message.includes('authorized')) {
      return NextResponse.json({ success: false, message: error.message }, { status: 403 });
    }
  }

  return NextResponse.json({ 
    success: false, 
    message: 'Internal Server Error' 
  }, { status: 500 });
}
