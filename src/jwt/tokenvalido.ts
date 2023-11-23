import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const ValidateToken = (
   req: Request,
   res: Response,
   next: NextFunction
 ): void => {
   let token: string | undefined = req.get("authorization");
   if (token) {
     token = token.slice(7);
    jwt.verify(token, process.env.SECRET_KEY, (err: any) => {
       if (err) {
         res.json({
           success: false,
           msg: "INVALID TOKEN",
         });
       } else {
         next();
       }
     });
   } else {
     res.json({
       success: false,
       msg: "ACCESS DENIED! UNATHORIZED",
     });
   }
 };
