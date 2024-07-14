import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(403).json({
      success: false,
      message: " JWT secret not found",
    });
  }

  const decoded = jwt.verify(token, secret) as JwtPayload;

  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: "token not verified",
    });
  }

  req.user = decoded;

  next();
};
