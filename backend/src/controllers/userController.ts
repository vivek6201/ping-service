import { Request, Response } from "express";
import prisma from "../utils/db";
import { ExtendedRequest } from "../middlewares/authMiddleware";

export const getAllUserController = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "failed to fetch data",
    });
  }
};

export const getCurrentUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be fetched",
    });
  }
};
