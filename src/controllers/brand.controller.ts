import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Brand } from "../models/Brand";
import { Like } from "typeorm";

class BrandController {
  static listBrand = async (req: Request, res: Response) => {
    const repoBrand = AppDataSource.getRepository(Brand);
    const name = req.query.name || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const skip = (page - 1) * limit;
      const brand = await repoBrand.find({
        where: { state: true, type: Like(`${name}`),},
         skip, take: limit ,
      });
      return brand.length > 0
        ? res.json({
            ok: true,
            msg: "LIST OF BRANDS",
            brand,
            page,
            limit,
            totalBrands: brand.length
          })
        : res.json({ ok: false, msg: "DATA NOT FOUND", brand });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR ==> ${error}`,
      });
    }
  };

  //CREAT BRAND

  static createBrand = async (req: Request, res: Response) => {
    const { type } = req.body;
    const repoBrand = AppDataSource.getRepository(Brand);
    try {
      const brand = new Brand();
      brand.type = type;
      await repoBrand.save(brand);
      return res.json({
        ok: true,
        message: "BRAND WAS CREATE ",
      });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
    }
  };

  //update brand
  static updateBrand = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { type } = req.body;
    const repoBrand = AppDataSource.getRepository(Brand);
    let brands: Brand;
    try {
      brands = await repoBrand.findOne({
        where: { id, state: true },
      });
      if (!brands) {
        throw new Error("Brand dont exist in database");
      }
      brands.type = type;
      await repoBrand.save(brands);
      return res.json({
        ok: true,
        message: "Brand was update",
      });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
    }
  };

  ///buscar por id
  static byIdBrand = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoBrand = AppDataSource.getRepository(Brand);
    try {
      const brand = await repoBrand.findOne({
        where: { id, state: true },
      });
      return brand
        ? res.json({ ok: true, brand, message: "SUCCESS" })
        : res.json({ ok: false, message: "THE ID DONT EXIST" });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
    }
  };

  //EliminarBrand de forma logica

  static deleteBrand = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoBrand = AppDataSource.getRepository(Brand);
    try {
      const brand = await repoBrand.findOne({
        where: { id, state: true },
      });
      if (!brand) {
        throw new Error("BRAND DONT EXIST IN DATABASE");
      }
      brand.state = false;
      await repoBrand.save(brand);
      return res.json({ ok: true, message: "BRAND WAS DELETE" });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
    }
  };

  static listQuery = async (req: Request, res: Response) => {
    const { type } = req.query;
    const repoBrand = AppDataSource.getRepository(Brand);
    try {
      const brand = await repoBrand
        .createQueryBuilder("brand")
        .where("brand.type = :type", { type: type, state: true })
        .getOne();
      return brand
        ? res.json({
            ok: true,
            message: "Type is ",
            brand,
          })
        : res.json({
            ok: false,
            message: "DATA NOT FOUND",
            brand,
          });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ===> ${error}`,
      });
    }
  };
}

export default BrandController;
