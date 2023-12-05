import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Rol } from "../models/Rol";
import { Like } from "typeorm";

const roleRepository = AppDataSource.getRepository(Rol);

class RoleController {
  //metodo de listar
  static listRoles = async (req: Request, res: Response) => {
    const repoRoles = AppDataSource.getRepository(Rol);
    const name = req.query.name || ""
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string ) || 5

    console.log(req.query)
    try {
      const skip = (page - 1) * limit;
      const rol = await repoRoles.find({
        where: { 
          state: true ,
          type: Like(`%${name}`)},
          skip,
          take: limit,
      });
      return rol.length > 0
        ? res.json({
            ok: true,
            msg: "LIST OF ROLES",
            rol,
            page,
            limit,
            totalRoles: rol.length
          })
        : res.json({ ok: false, msg: "DATA NOT FOUND", rol });
    } catch (e) {
      return res.json({
        ok: false,
        msg: `ERROR => ${e}`,
      });
    }
  };
  
  //metodo de crear
  static createRol = async (req: Request, res: Response) => {
    const { type } = req.body;
    try {
      const rol = new Rol();
      rol.type = type;
      await roleRepository.save(rol);
      return res.json({
        ok: true,
        msg: "ROL WAS CREATE",
      });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR => ${error}`,
      });
    }
  };

  static modifyRol = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { type } = req.body;
    const repoRoles = AppDataSource.getRepository(Rol);
    let role: Rol;

    try {
      role = await repoRoles.findOne({
        where: { id, state: true },
      });
      if (!type) {
        throw new Error("Rol not found");
      }
      role.type = type;
      await roleRepository.save(role);
      return res.json({ ok: true, msg: "Rol updated" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR SERVER => ${error}`,
      });
    }
  };

  /// obtener por id Rol
  static getId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoRol = AppDataSource.getRepository(Rol);
    try {
      const getid = await repoRol.findOne({
        where: { id, state: true },
      });
      return getid
        ? res.json({ id, ok: true, getid, msg: "Succesfully" })
        : res.json({ ok: false, msg: "The Id doesn't exist" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR SERVER => ${error}`,
      });
    }
  };

  // DELETE ROL
  static deleteRol = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const reposRol = AppDataSource.getRepository(Rol);

    try {
      const deleterol = await reposRol.findOne({
        where: { id, state: true },
      });
      if (!deleterol) {
        throw new Error("not found Rol");
      }
      deleterol.state = false;
      await reposRol.save(deleterol);
      return res.json({ ok: true, msg: "ROL WAS DELETE" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR SERVER => ${error}`,
      });
    }
  };
}
export default RoleController;
