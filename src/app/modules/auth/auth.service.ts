import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma, Prisma } from "./../../../lib/prisma";
import { IAuthLogin } from "./auth.interface";
import { UserStatus } from "@prisma/client";
import { AppError } from "../../shared/AppError";
import httpStatus from "http-status";

const login = async (payload: IAuthLogin) => {
  const { password, email } = payload;

  // Find user with email and active status
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
    include: {
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Verify password
  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Generate JWT token
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "default-secret",
    { expiresIn: "7d" }
  );
  const refreshToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_TOKEN || "refresh-secret",
    { expiresIn: "90d" }
  );

  // Prepare user data (excluding password)
  const { password: _, ...userData } = user;

  return {
    user: userData,
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  login,
};
