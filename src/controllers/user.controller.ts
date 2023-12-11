import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Rol } from "../models/Rol";
import { User } from "../models/User";
import { Like } from "typeorm";
import { Not } from 'typeorm';

class UserController {
  static listUser = async (req: Request, res: Response) => {
    const rol = req.query.rol || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const skip = (page - 1) * limit;
      const user = await userRepository.find({
        where: { state: true, rol: { type: Like(`%${rol}%`) } },
        relations: { rol: true },
        skip, take: limit ,
      });

      return user.length > 0
        ? res.json({
            ok: true,
            msg: "LIST OF USERS",
            user,
            page,
            limit,
            totalClients: user.length
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
      const userExist = await userRepository.findOne({where: {email}})
      if(userExist){
        return res.json({ok: false, message: `Email '${email}' already exists` })
      }

      if (rolId) {
        existingRol = await repoRol.findOne({ where: { id: rolId } });
        if (!existingRol) {
          return res.json({
            ok: false,
            msg: `ROL WITH ID '${rolId}' DON'T EXIST`,
          });
        }
      } else{
        if(existingRol?.rol && rolId){
          return res.json({
            ok: false,
            msg: 'Cannot assign rol to a regular user'
          })
        }
      }

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;
      user.rol = existingRol;
      user.hashPassword();

      await userRepository.save(user);

      return res.json({
        ok: true,
        msg: "Users was create",
        user,
      });
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
    let user: User

    try {
      user = await userRepository.findOne({
        where: { id, state: true },
      });

      if (!user) {
        throw new Error("USER DON'T EXIST IN THE DATABASE");
      }
      
      const existingUser = await userRepository.findOne({
        where: {email, id: Not(id)},
      })

      if(existingUser){
        return res.json({
          ok: false,
          msg: `Email with ID '${email}' already exist`,
        })
      }

      const existingRol = await repoRol.findOne({ where: { id: rolId } });

      if (!existingRol) {
        return res.json({
          ok: false,
          msg: `ROL WITH ID '${rolId}' DON'T EXIST`,
        });
      }

      user.rol = existingRol;
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
        : res.json({ ok: false, msg: "THE ID DON'T EXIST" });
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
        throw new Error("User don't exist in data base");
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
