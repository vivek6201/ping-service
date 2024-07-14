import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations/authValidations";
import prisma from "../utils/db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginController = async (req: Request, res: Response) => {
  const body = req.body;

  const { success, data, error } = await loginSchema.safeParseAsync(body);

  if (!success) {
    return res.status(401).json({
      success: false,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pass = await bcryptjs.compare(data.password, user.password);

    if (!pass) {
      return res.status(403).json({
        success: false,
        message: "Invalid pass",
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(404).json({
        success: false,
        message: "JWT secret not found!",
      });
    }

    const token = jwt.sign(payload, secret);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error while entering into db",
    });
  }
};

export const signupController = async (req: Request, res: Response) => {
  const body = req.body;

  const { success, data, error } = await registerSchema.safeParseAsync(body);

  if (!success) {
    return res.status(401).json({
      success: false,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (user) {
    return res.status(403).json({
      success: false,
      message: "user already exists",
    });
  }

  const hashedPass = await bcryptjs.hash(data.password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        password: hashedPass,
      },
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
    };

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(403).json({
        success: false,
        message: "jwt secret missing",
      });
    }

    const token = jwt.sign(payload, secret);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "new user created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { expires: new Date(0), path: '/' });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
