import { NextResponse } from 'next/server';

export const successResponse = <T>(data: T, status: number = 200) => {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
};

export const errorResponse = (
  message: string,
  status: number = 400,
  errors?: any
) => {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status }
  );
};

export const validationErrorResponse = (errors: any) => {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors,
    },
    { status: 422 }
  );
};
