import IUser from "../types/IUser";
import { registerValidation } from "../validations/user";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import IClientResponse from "../types/clientResponse";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: IUser = await registerValidation.validateAsync(req.body);

    if (result) {
      const salt = await bcrypt.genSalt(10);

      const hash = await bcrypt.hash(result.password, salt);

      const newUser = new User({ ...result, password: hash });

      const savedUser = await newUser.save();

      if (savedUser) {
        res.json(<IClientResponse>{
          message: "Account created successfully",
          data: savedUser,
          error: null,
          success: true,
        });
      }
    }
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
};