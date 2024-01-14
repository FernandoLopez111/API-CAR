import { CarWash } from "../models/CarWash";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Client } from "../models/Client";
import { Like } from "typeorm";

class CarwashController {
  static listCarwash = async (req: Request, res: Response) => {
    const type = req.query.type || "";
    const client = req.query.client || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const repoCarwash = AppDataSource.getRepository(CarWash);

    console.log(req.query)
    try {
      
      const [carwashs, total] = await repoCarwash.findAndCount({
        where: {
          state: true,
          type: Like(`%${type}%`),
          client: {
            name: Like(`%${client}%`)
          }
        },
        order: {type: "DESC"}, 
        skip: (page - 1) * limit,
        take: limit ,
        relations:{client:true}
      });

      if (carwashs.length > 0) {
        let totalPage: number = Number(total) / limit;
        if (totalPage % 1 !== 0) {
          totalPage = Math.trunc(totalPage) + 1;
        }

        let nextPage: number = page >= totalPage ? page : Number(page) + 1;
        let prevPage: number = page <= 1 ? page : page - 1;

        return res.json({
          ok: true,
          msg: "List of carwashs",
          carwashs,
          total,
          totalPage,
          currentPage: Number(page),
          nextPage,
          prevPage,
        });
      }
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR ==> ${error}`,
      });
    }
  };

  static createCarwash = async (req: Request, res: Response) => {
    const { clientId, type, price, amount } = req.body;
    const repoClient = AppDataSource.getRepository(Client);
    const repoCarWash = AppDataSource.getRepository(CarWash);
    try {
      const newUser = await repoClient.findOne({
        where: { id: clientId },
      });

      if (!newUser) {
        return res.json({
          ok: false,
          message: "Client not found",
        });
      }

      const carwash = new CarWash();
      carwash.type = type;
      carwash.price = price;
      carwash.amount = amount;
      carwash.client = clientId;
      carwash.subTotal = price * amount;
      console.log(carwash);

      let discount = 0.1;
      if (newUser.points >= 20) {
        discount = 0.2;
      }
      carwash.subTotal = price * amount;
      carwash.total = carwash.subTotal - carwash.subTotal * discount;
      newUser.points += amount;

      newUser.points -= 20;

      if (newUser.points < 0) {
        newUser.points = 0;
      } else {
        carwash.subTotal = price * amount;
        carwash.total = carwash.subTotal;
      }

      newUser.points += amount;

      await repoCarWash.save(carwash);
      await repoClient.save(newUser);

      return res.json({
        ok: true,
        message: "CARWASH CREATE",
        carwash,
      });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR= ${error.message}`,
      });
    }
  };

  static updateService = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoService = AppDataSource.getRepository(CarWash);
    const repoClient = AppDataSource.getRepository(Client);
    const { type, price, amount, clientId } = req.body;
    try {
      const carwash = await repoService.findOne({
        where: { id, state: true },
      });

      if (!carwash) {
        throw new Error("SERVICE DONT NOT EXIST IN THE DATABASE");
      }
      const newUser = await repoClient.findOne({
        where: { id: clientId },
      });
      if (!newUser) {
        return res.json({
          ok: false,
          msg: `CLIENT WITH ID '${clientId}' DOESN'T EXIST`,
        });
      }

      carwash.type = type;
      carwash.price = price;
      carwash.amount = amount;
      carwash.client = clientId;

      let discount = 0.1;
      if (newUser.points >= 20) {
        discount = 0.2;
      }
      carwash.subTotal = price * amount;
      carwash.total = carwash.subTotal - carwash.subTotal * discount;
      newUser.points += amount;

      newUser.points -= 20;

      if (newUser.points < 0) {
        newUser.points = 0;
      } else {
        carwash.subTotal = price * amount;
        carwash.total = carwash.subTotal;
      }

      newUser.points += amount;

      console.log(carwash);
      await repoService.save(carwash)
        ? res.json({ ok: true, carwash, msg: "SERVICE WAS UPDATED" })
        : res.json({ ok: false, msg: "THE ID DONT EXIST" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Server error => ${error}`,
      });
    }
  };

  static byIdService = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoCarWash = AppDataSource.getRepository(CarWash);

    try {
      const carwash = await repoCarWash.findOne({
        where: { id, state: true },
      });
      return carwash
        ? res.json({ ok: true, carwash, msg: "SUCCESSFULLY" })
        : res.json({ ok: false, msg: "THE ID DOESN'T EXIST" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Server error => ${error}`,
      });
    }
  };

  static deleteService = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoCarWash = AppDataSource.getRepository(CarWash);
    try {
      const carwash = await repoCarWash.findOne({
        where: { id, state: true },
      });
      if (!carwash) {
        throw new Error("SERVICE DONT EXIST IN THE DATABSE");
      }
      carwash.state = false;
      await repoCarWash.save(carwash);
      return res.json({ ok: true, msg: "SERVICE WAS DELETE" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Server error => ${error}`,
      });
    }
  };
}

export default CarwashController;
