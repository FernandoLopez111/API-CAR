import { User } from "../models/User";
import jwt = require("jsonwebtoken");

export const tokenAuth = async (user: User) => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    rol: user.rolId,
  },
  process.env.SECRET_KEY,
  {
    expiresIn: '48h'
  }
  );
};

