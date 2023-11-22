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
    const repoService = AppDataSource.getRepository(CarWash);

    try {
      const service = new CarWash();
      service.client = clientId;
      service.type = type;
      service.price = price;
      service.amount = amount;
      service.subTotal = subtotal;
      service.total = total;

      let subt = price * amount;
      service.subTotal = subt;
      service.total = parseFloat(service.subTotal.toFixed(2));
      let disc1 = subtotal * 0.15;

      const client_f = await repoClient.findOne({ where: { id: clientId } });

      if (client_f.points >= 10 && client_f.points < 20) {
        client_f.points = client_f.points + service.amount;
        service.total = parseFloat(
          (service.subTotal - service.subTotal * 0.1).toFixed(2)
        );
        await repoService.save(service);
        repoClient.save(client_f);
        return res.json({
          ok: true,
          message: "points are 10 or more get a 15% discount rent was creaetd",
        });
      } else if (client_f.points > 20) {
        client_f.points = client_f.points + service.amount;
        service.total = service.subTotal - service.subTotal * 0.2;
        await repoService.save(service);
        repoClient.save(client_f);
        return res.json({
          ok: true,
          message: "points are 20 or more get a 20% discount rent was creaetd",
        });
      } else {
        client_f.points = client_f.points + service.amount;

        await repoService.save(service);
        repoClient.save(client_f);
        return res.json({ ok: true, message: " rent was creaetd" });
      }
    } catch (error) {
      return res.json({
        ok: false,
        message: `error that movie does not exist = ${error.message}`,
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
      // const existingClient = await repoClient.findOne({ where: { id: clientId } });
      // if (!existingClient) {
      //   return res.json({
      //     ok: false,
      //     msg: `CLIENT WITH ID '${clientId}' DOESN'T EXIST`,
      //   });
      // }
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
