import { CarWash } from "../models/CarWash";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Client } from "../models/Client";
import { Like } from "typeorm";

class CarwashController {
  static listCarwash = async (req: Request, res: Response) => {
    const type = req.query.type || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const repoCarwash = AppDataSource.getRepository(CarWash);

    try {
      const skip = (page - 1) * limit;
      const carwash = await repoCarwash.find({
        where: {
          state: true,
          type: Like(`%${type}%`),
        },
        skip, take: limit ,
        relations:{client:true}
      });
      return carwash.length > 0
        ? res.json({
            ok: true,
            msg: "LIST OF SERVICES",
            carwash,
            page,
            limit,
            totalClients: carwash.length
          })
        : res.json({ ok: false, msg: "DATA NOT FOUND", carwash });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR ==> ${error}`,
      });
    }
  };
  static createCarwash = async (req: Request, res: Response) => {
    const { clientId, type, price, amount, subtotal, total } = req.body;
    const repoClient = AppDataSource.getRepository(Client);
    const repoCarWash = AppDataSource.getRepository(CarWash);
    try {
      const newUser = await repoClient.findOne({
        where: {
          id: clientId,
        },
      });
      const carwash = new CarWash();
      carwash.client = clientId;
      carwash.type = type;
      carwash.price = price;
      carwash.amount = amount;
      carwash.subTotal = subtotal;
      carwash.total = total;

      let SubTotal = price * amount;
      carwash.subTotal = SubTotal;
      if (newUser.points >= 10) {
        newUser.points = newUser.points + carwash.amount;
        carwash.total = parseFloat(
          (carwash.subTotal - carwash.subTotal * 0.1).toFixed(2)
        );
        newUser.points = newUser.points - newUser.points;
        await repoCarWash.save(carwash);
        repoClient.save(newUser);
        return res.json({
          ok: true,
          message: "POINTS ARE 10 THE DISCOUNT IS THE 10%",
        });
      } else if (newUser.points >= 20) {
        newUser.points = newUser.points + carwash.amount;
        carwash.total = carwash.subTotal - carwash.subTotal * 0.2;
        newUser.points = newUser.points - newUser.points;
        await repoCarWash.save(carwash);
        repoClient.save(newUser);
        return res.json({
          ok: true,
          message: "POINTS ARE 20 THE DISCOUNT IS THE 20%",
        });
      }
      newUser.points = newUser.points - newUser.points;
      await repoCarWash.save(carwash);
      repoClient.save(carwash);
      return res.json({ ok: true, message: "CARWASH WAS CREATE" });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR THAT CLIENT DONT EXIST = ${error.message}`,
      });
    }
  };
  static updateService = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoCarWash = AppDataSource.getRepository(CarWash);
    const { type, price } = req.body;

    try {
      const carwash = await repoCarWash.findOne({
        where: { id, state: true },
      });
      if (!carwash) {
        throw new Error("SERVICE DONT NOT EXIST IN THE DATABASE");
      }

      carwash.type = type;
      carwash.price = price;
      (await repoCarWash.save(carwash))
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
