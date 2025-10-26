import bcrypt from "bcryptjs";
import { prisma, Prisma } from "./../../../lib/prisma";
import { UserStatus } from "@prisma/client";
const createPatient = async (
  payload: Prisma.PatientCreateInput & Prisma.UserCreateInput
) => {
  const {
    password,
    email,
    name,
    user,
    address,
    admin,
    doctor,
    needPasswordChange,
    profilePhoto,
    role,
    patient,
    status,
  } = payload;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const result = prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        needPasswordChange,
        status,
        admin,
        doctor,
        patient,
      },
    });
    return await tnx.patient.create({
      data: {
        name,
        address,
        email,
      },
    });
  });

  return result;
};

const getAllUser = ({
  page,
  limit,
  search,
  role
}: {
  page: number;
  limit: number;
  search?: string;
  role?:any;
}) => {
  const skip = (page - 1) * limit;
  const result = prisma.user.findMany({
    skip,
    take: limit,
    where: {
      email: {
        contains: search,
        mode: "insensitive",
      },
      role,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};
export const UserService = {
  createPatient,
  getAllUser,
};
