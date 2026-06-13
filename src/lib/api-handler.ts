import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { ApiError } from './api-error';

type AppContext = { params: Promise<Record<string, string>> };

type HandlerContext = {
  req: NextRequest;
  userId: string;
  params: Record<string, string>;
};

type ApiHandlerFunc = (ctx: HandlerContext) => Promise<NextResponse>;

/**
 * Higher-order wrapper for Next.js API routes.
 * Enforces standardized error handling and requires authentication by default.
 */
export function withErrorHandler(handler: ApiHandlerFunc, requireAuth: boolean = true) {
  return async (req: NextRequest, context?: AppContext): Promise<NextResponse> => {
    try {
      let userId = '';

      if (requireAuth) {
        const authData = await auth();
        if (!authData || !authData.userId) {
          throw ApiError.unauthorized();
        }
        userId = authData.userId;
      }

      const params = context?.params ? await context.params : {};

      return await handler({ req, userId, params });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, details: error.details },
          { status: error.statusCode }
        );
      }

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation Error', details: error.issues },
          { status: 400 }
        );
      }

      console.error('[API_ERROR_BOUNDARY]', error);

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
