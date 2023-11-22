import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Model } from "../models/Model";

class ModelController {
  //metodo de obtener todos
  static listModel = async (req: Request, res: Response) => {
    const repoModel = AppDataSource.getRepository(Model);
    try {
      const model = await repoModel.find({
        where: { state: true },
      });
      return model.length > 0
        ? res.json({
            ok: true,
            message: "LIST OF MODELS",
            model,
          })
        : res.json({
            ok: false,
            message: "DATA NOT FOUND ",
            model,
          });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
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
