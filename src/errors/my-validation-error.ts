import { ValidationError } from 'class-validator';

export class MyValidationError extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.errors = errors;
  }
}
