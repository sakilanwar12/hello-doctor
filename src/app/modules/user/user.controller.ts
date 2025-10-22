import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  res.send("createPatient");
});

export const UserController = {
  createPatient,
};
