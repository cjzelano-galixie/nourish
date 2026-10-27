export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends AppError {
  constructor(message, status) {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message, status) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message, status) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(messsage, status) {
    super(messsage, 403);
  }
}
