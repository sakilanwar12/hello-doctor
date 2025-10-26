import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../shared/AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
