import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: string,
  ) {
    super(
      {
        statusCode,
        message,
        error: error || 'Application Error',
      },
      statusCode,
    );
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, 'Not Found');
  }
}

export class BadRequestException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST, 'Bad Request');
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized access') {
    super(message, HttpStatus.UNAUTHORIZED, 'Unauthorized');
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Access forbidden') {
    super(message, HttpStatus.FORBIDDEN, 'Forbidden');
  }
}
