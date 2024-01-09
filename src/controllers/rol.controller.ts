import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Rol } from "../models/Rol";
import { Like } from "typeorm";

const roleRepository = AppDataSource.getRepository(Rol);

class RoleController {
  //metodo de listar
  static listRoles = async (req: Request, res: Response) => {
    const name = req.query.name || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    console.log(req.query);
    try {
      const [roles, total] = await roleRepository.findAndCount({
        where: { state: true, type: Like(`%${name}%`) },
        order: { type: "ASC" },
        skip: (page - 1) * limit,
        take: limit,
      });

      if (roles.length > 0) {
        let totalPage: number = Number(total) / limit;
        if (totalPage % 1 !== 0) {
          totalPage = Math.trunc(totalPage) + 1;
        }
        let nextPage: number = page >= totalPage ? page : Number(page) + 1;
        let prevPage: number = page <= 1 ? page : page - 1;

        return res.json({
          ok: true,
          roles,
          total,
          totalPage,
          currentPage: Number(page),
          nextPage,
          prevPage,
        });
      }
    } catch (error) {
      ok: false;
      StatusCode: 500;
      message: `error = ${error.message}`;
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
