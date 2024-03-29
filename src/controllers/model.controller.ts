import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Model } from "../models/Model";
import { Like } from "typeorm";

class ModelController {
  //metodo de obtener todos
  static listModel = async (req: Request, res: Response) => {
    const name = req.query.name || "";
    const repoModel = AppDataSource.getRepository(Model);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    console.log(req.body);
    
    try {
      const [models, total] = await repoModel.findAndCount({
        where: { state: true, typemodel:Like(`%${name}%`) },
        order: { typemodel: "DESC"},
        skip: (page -1 ) * limit, 
        take: limit ,
      });
      if (models.length > 0) {
        let totalPage: number = Number(total) / limit;
        if (totalPage % 1 !== 0) {
          totalPage = Math.trunc(totalPage) + 1;
        }
        let nextPage: number = page >= totalPage ? page : Number(page) + 1;
        let prevPage: number = page <= 1 ? page : page - 1;

        return res.json({
          ok: true,
          models,
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
  static createModel = async (req: Request, res: Response) => {
    const { typemodel } = req.body;
    const repoModel = AppDataSource.getRepository(Model);
    try {
      const model = new Model();
      model.typemodel = typemodel;
      await repoModel.save(model);
      return res.json({
        ok: true,
        message: "model was create",
      });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==>  ${error}`,
      });
    }
  };

  //modificar
  static updateModel = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { typemodel } = req.body;
    const repoModel = AppDataSource.getRepository(Model);
    let models: Model;
    try {
      models = await repoModel.findOne({
        where: { id, state: true },
      });
      if (!models) {
        throw new Error("MODEL DONT EXIST IN DATABASE");
      }
      models.typemodel = typemodel;
      await repoModel.save(models);
      return res.json({
        ok: true,
        message: "Models was Update",
      });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
    }
  };

  //metodo de busqueda por id

  static byIdModel = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoModel = AppDataSource.getRepository(Model);
    try {
      const model = await repoModel.findOne({
        where: { id, state: true },
      });
      return model
        ? res.json({
            ok: true,
            model,
            message: "SUCCESS",
          })
        : res.json({
            ok: false,
            message: "THE ID DONT EXIST",
          });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ===>  ${error}`,
      });
    }
  };

  //deshabilitar o eliminacion logica
  static deleteModel = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoModel = AppDataSource.getRepository(Model);

    try {
      const model = await repoModel.findOne({
        where: { id, state: true },
      });
      if (!model) {
        throw new Error("Model dont exist in database");
      }
      model.state = false;
      await repoModel.save(model);
      return res.json({
        ok: true,
        message: "Model was delete",
      });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR  ===> ${error}`,
      });
    }
  };

  static listQuery = async (req: Request, res: Response) => {
    const { typemodel } = req.query;
    const repoModel = AppDataSource.getRepository(Model);
    try {
      const model = await repoModel
        .createQueryBuilder("model")
        .where("model.typemodel = :typemodel", {
          typemodel: typemodel,
          state: true,
        })
        .getOne();
      return model
        ? res.json({
            ok: true,
            message: "TypeModel is ",
            model,
          })
        : res.json({
            ok: false,
            message: "Data not found",
            model,
          });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
    }
  };
}

export default ModelController;
