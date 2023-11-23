import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Rol } from "../models/Rol";
import { User } from "../models/User";
import { Like } from "typeorm";

class UserController {
  static listUser = async (req: Request, res: Response) => {
    const rol = req.query.rol || "";
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.find({
        where: { state: true, rol: { type: Like(`%${rol}%`) } },
        relations: { rol: true },
      });

      return user.length > 0
        ? res.json({
            ok: true,
            msg: "LIST OF USERS",
            user,
          })
        : res.json({ ok: false, msg: "DATA NOT FOUND", user });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Error => ${error}`,
      });
    }
  };

  static createUser = async (req: Request, res: Response) => {
    const { name, email, password, rolId } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const repoRol = AppDataSource.getRepository(Rol);
    let existingRol;

    try {
      if (rolId) {
        existingRol = await repoRol.findOne({ where: { id: rolId } });
        if (!existingRol) {
          return res.json({
            ok: false,
            msg: `ROL WITH ID '${rolId}' DONT EXIST`,
          });
        }
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = password;
        user.rol = rolId;
        user.hashPassword();
        await userRepository.save(user);
        return res.json({
          ok: true,
          msg: "Users was create",
          user,
        });
      }
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Error => ${error}`,
      });
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userRepository = AppDataSource.getRepository(User);
    const repoRol = AppDataSource.getRepository(Rol);
    const { rolId, name, email, password } = req.body;

    try {
      const user = await userRepository.findOneOrFail({
        where: { id, state: true },
      });
      if (!user) {
        throw new Error("USER DONT EXIST IN THE DATABASE");
      }
      const existingRol = await repoRol.findOne({ where: { id: rolId } });
      if (!existingRol) {
        return res.json({
          ok: false,
          msg: `ROL WITH ID '${rolId}' DONT EXIST`,
        });
      }
      user.rol = rolId;
      user.name = name;
      user.email = email;
      user.password = password;
      await userRepository.save(user);
      return res.json({
        ok: true,
        msg: "USER WAS UPDATE",
        user: user,
      });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Error => ${error}`,
      });
    }
  };

  static byIdUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: { id, state: true },
      });
      return user
        ? res.json({ ok: true, user, msg: "SUCCESSFULLY" })
        : res.json({ ok: false, msg: "THE ID DONT EXIST" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR => ${error}`,
      });
    }
  };
  static deleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: { id, state: true },
      });
      if (!user) {
        throw new Error("User dont exist in data base");
      }
      user.state = false;
      await userRepository.save(user);
      return res.json({
        ok: true,
        msg: "USER WAS DELETE",
      });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR => ${error}`,
      });
    }
  };
}
export default UserController;
