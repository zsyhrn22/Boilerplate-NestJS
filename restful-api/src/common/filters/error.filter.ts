import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface ErrorResult {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const { response, request } = this.getContext(host);

    const { status, message, errors } = this.resolveException(exception);

    this.logError(exception, status, request.url, message);

    response.status(status).json({
      message,
      ...(errors && { errors }),
    });
  }

  /**
   * Extract request & response from context
   */
  private getContext(host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    return {
      response: ctx.getResponse<Response>(),
      request: ctx.getRequest(),
    };
  }

  /**
   * Determine how to process the exception
   */
  private resolveException(exception: unknown): ErrorResult {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    if (exception instanceof QueryFailedError) {
      return this.handleQueryFailedError(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };
  }

  /**
   * Handle NestJS HttpExceptions
   */
  private handleHttpException(exception: HttpException): ErrorResult {
    const status = exception.getStatus();
    const resObj = exception.getResponse() as any;

    let message = resObj.message || resObj.error || 'Error';
    let errors: Record<string, string[]> | undefined;

    // class-validator errors
    if (Array.isArray(resObj.message)) {
      const formatted = this.formatValidationErrors(resObj.message);
      message = formatted.message;
      errors = formatted.errors;
    }

    // pre-formatted errors
    if (resObj.errors) {
      errors = resObj.errors;
    }

    return { status, message, errors };
  }

  /**
   * Handle database errors
   */
  private handleQueryFailedError(error: QueryFailedError): ErrorResult {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: this.sanitizeQueryError(error),
    };
  }

  /**
   * Format class-validator errors
   */
  private formatValidationErrors(messages: any[]) {
    const errors: Record<string, string[]> = {};

    for (const msg of messages) {
      if (msg?.property && msg?.constraints) {
        errors[msg.property] = Object.values(msg.constraints) as string[];
      }
    }

    return {
      message: 'Validation Errors',
      errors,
    };
  }

  /**
   * Convert database error to safe message
   */
  private sanitizeQueryError(error: QueryFailedError): string {
    const msg = error.message.toLowerCase();

    if (msg.includes('unique') || msg.includes('duplicate')) {
      return 'A record with this value already exists';
    }

    if (msg.includes('foreign key')) {
      return 'Cannot perform this operation due to related records';
    }

    if (msg.includes('null')) {
      return 'Required field is missing';
    }

    if (msg.includes('check')) {
      return 'Invalid data provided';
    }

    return 'Database operation failed';
  }

  /**
   * Log errors
   */
  private logError(
    exception: unknown,
    status: number,
    url: string,
    message: string,
  ) {
    const logMessage = `HTTP ${status} [${url}]: ${message}`;

    if (status >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(logMessage);
    }
  }
}
