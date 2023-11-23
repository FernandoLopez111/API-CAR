import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Car } from "../models/Car";
import { Client } from "../models/Client";
import { Like } from "typeorm";

class ClientsController {
  static listClient = async (req: Request, res: Response) => {
    const name = req.query.name || "";
    const car = req.query.car || "";
    const repoCar = AppDataSource.getRepository(Client);
    try {
      const client = await repoCar.find({
        where: {
          state: true,
          name: Like(`%${name}%`),
          car: { color: Like(`%${car}%`) },
        },
        relations: { car: true },
      });
      return client.length > 0
        ? res.json({
            ok: true,
            msg: "LIST OF CLIENTS",
            client,
          })
        : res.json({ ok: false, msg: "DATA NOT FOUND", client });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR ==> ${error}`,
      });
    }
  };
  static createClient = async (req: Request, res: Response) => {
    const { carId, name, phone } = req.body;
    const repoClient = AppDataSource.getRepository(Client);
    const repoCar = AppDataSource.getRepository(Car);
    let existingCar;

    try {
      if (carId) {
        existingCar = await repoCar.findOne({ where: { id: carId } });
        if (!existingCar) {
          return res.json({
            ok: false,
            msg: `CAR WITH ID '${carId}' DONT NOT EXIST`,
          });
        }
        const client = new Client();
        client.car = carId;
        client.name = name;
        client.phone = phone;
        await repoClient.save(client);
        return res.json({
          ok: true,
          msg: "CLIENT WAS CREATE",
          client,
        });
      }
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Error => ${error}`,
      });
    }
  };

  static updateClient = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoClient = AppDataSource.getRepository(Client);
    const repoCar = AppDataSource.getRepository(Car);
    const { carId, name, phone } = req.body;

    try {
      const client = await repoClient.findOne({
        where: { id, state: true },
      });
      if (!client) {
        throw new Error("CLIENT DONT NOT EXIST IN THE DATABASE");
      }
      const existingRol = await repoCar.findOne({ where: { id: carId } });
      if (!existingRol) {
        return res.json({
          ok: false,
          msg: `CAR WITH ID '${carId}' DOESN'T EXIST`,
        });
      }
      client.car = carId;
      client.name = name;
      client.phone = phone;
      (await repoClient.save(client))
        ? res.json({ ok: true, client, msg: "CLIENT WAS UPDATED" })
        : res.json({ ok: false, msg: "THE ID DONT EXIST" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Server error => ${error}`,
      });
    }
  };
  static byIdClient = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoClient = AppDataSource.getRepository(Client);

    try {
      const client = await repoClient.findOne({
        where: { id, state: true },
      });
      return client
        ? res.json({ ok: true, client, msg: "SUCCESSFULLY" })
        : res.json({ ok: false, msg: "THE ID DOESN'T EXIST" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Server error => ${error}`,
      });
    }
  };

  static deleteClient = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoClient = AppDataSource.getRepository(Client);
    try {
      const client = await repoClient.findOne({
        where: { id, state: true },
      });
      if (!client) {
        throw new Error("CLIENT DONT EXIST IN THE DATABSE");
      }
      client.state = false;
      await repoClient.save(client);
      return res.json({ ok: true, msg: "CLIENT WAS DELETE" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Server error => ${error}`,
      });
    }
  };

  static getCar = async (req: Request, res: Response) => {
    const carId = Number(req.params.id) || 0;
    const repoClient = AppDataSource.getRepository(Client);
    try {
      const client = await repoClient.find({
        where: {
          state: true,
          car: { id: carId },
        },
        relations: { car: true },
      });
      return client.length > 0
        ? res.json({ ok: true, client })
        : res.json({ ok: false, msg: "THE IDCAR DONT EXIST" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `Server error => ${error}`,
      });
    }
  };
}
export default ClientsController;
