import { CarWash } from "../models/CarWash";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Client } from "../models/Client";
import { Like } from "typeorm";

class CarwashController {
  static listCarwash = async (req: Request, res: Response) => {
    const type = req.query.type || "";
    const repoClient = AppDataSource.getRepository(CarWash);

    try {
      const service = await repoClient.find({
        where: {
          state: true,
          type: Like(`%${type}%`),
        },
      });
      return service.length > 0
        ? res.json({
            ok: true,
            msg: "LIST OF SERVICES",
            service,
          })
        : res.json({ ok: false, msg: "DATA NOT FOUND", service });
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
    const repoService = AppDataSource.getRepository(CarWash);
    const { type, price } = req.body;

    try {
      const service = await repoService.findOne({
        where: { id, state: true },
      });
      if (!service) {
        throw new Error("SERVICE DONT NOT EXIST IN THE DATABASE");
      }

      service.type = type;
      service.price = price;
      (await repoService.save(service))
        ? res.json({ ok: true, service, msg: "SERVICE WAS UPDATED" })
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
    const repoService = AppDataSource.getRepository(CarWash);

    try {
      const service = await repoService.findOne({
        where: { id, state: true },
      });
      return service
        ? res.json({ ok: true, service, msg: "SUCCESSFULLY" })
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
    const repoService = AppDataSource.getRepository(CarWash);
    try {
      const service = await repoService.findOne({
        where: { id, state: true },
      });
      if (!service) {
        throw new Error("SERVICE DONT EXIST IN THE DATABSE");
      }
      service.state = false;
      await repoService.save(service);
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
