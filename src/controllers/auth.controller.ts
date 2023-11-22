import { Request, Response } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import{tokenAuth} from '../jwt/jwt'
class AuthController {
  static Login = async (req: Request, res: Response) => {
    const authRepo = AppDataSource.getRepository(User);
    const { email, password} = req.body;

    try {
      const user = await authRepo.findOne({
        where: { email, state: true },
      });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.json({
          ok: false,
          msg: "EMAIL OR PASSWORD INCORRECT ",
        });
      }
     
      const token = await tokenAuth(user)

      return res.json({
        ok:true,
        msg: "Welcome my friend",
        token
      })

    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR ==> ${error}`,
      });
    }
  };
}
export default AuthController;
