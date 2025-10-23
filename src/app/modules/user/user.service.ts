import bcrypt from "bcryptjs";
import { prisma, Prisma } from "./../../../lib/prisma";
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
  console.log(result);

  return result;
};

export const UserService = {
  createPatient,
};
