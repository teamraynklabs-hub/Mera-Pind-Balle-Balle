import { NextResponse } from "next/server";

export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  requestId?: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApiError(
  statusCode: number,
  code: string,
  message: string
): ApiError {
  return new ApiError(statusCode, code, message);
}

export function handleApiError(
  error: unknown,
  requestId?: string
): NextResponse<ApiErrorResponse> {
  console.error(`[${requestId || "unknown"}] API Error:`, error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        requestId,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON in request body",
        code: "INVALID_JSON",
        requestId,
      },
      { status: 400 }
    );
  }

  // Generic error response (don't expose implementation details)
  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred",
      code: "INTERNAL_SERVER_ERROR",
      requestId,
    },
    { status: 500 }
  );
}

export function createSuccessResponse<T>(
  data?: T,
  message?: string
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}
