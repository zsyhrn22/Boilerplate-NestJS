import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

function formatValidationErrors(
  errors: ValidationError[],
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const error of errors) {
    const { property, constraints, children } = error;

    // Simple validation
    if (constraints) {
      result[property] = Object.values(constraints);
    }

    // Nested validation
    if (children?.length) {
      const isArray = children.every((c) => !isNaN(Number(c.property)));

      if (isArray) {
        result[property] = children.map((child) =>
          formatValidationErrors(child.children ?? []),
        );
      } else {
        result[property] = formatValidationErrors(children);
      }
    }
  }
  return result;
}

export function AppValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: false,
    },
    validationError: {
      target: false,
      value: false,
    },
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException({
        message: 'Validation Errors',
        errors: formatValidationErrors(validationErrors),
      });
    },
  });
}
