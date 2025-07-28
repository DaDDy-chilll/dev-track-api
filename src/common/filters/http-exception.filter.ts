import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Handle Prisma specific errors
    if (exception.code && exception.code.startsWith('P')) {
      // Prisma error codes start with P
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: this.getPrismaErrorMessage(exception),
        error: 'Database Error',
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
      error: exception.name || 'Error',
    });
  }

  private getPrismaErrorMessage(exception: any): string {
    // Handle specific Prisma error codes
    switch (exception.code) {
      case 'P2002':
        return `Unique constraint failed on field: ${exception.meta?.target}`;
      case 'P2025':
        return 'Record not found';
      default:
        return exception.message || 'Database error occurred';
    }
  }
}
