import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, search, role } = req.query;
  const result = await UserService.getAllUser({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    role,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get All User",
    data: result,
  });
});

export const UserController = {
  createPatient,
  getAllUser,
};
