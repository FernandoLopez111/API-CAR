import { Router } from "express";
import ClientsController from "../controllers/client.controller";

const router = Router();
const client = ClientsController;

router.get("/", client.listClient);
router.get("/car/:id", client.getCar);
router.post("/", client.createClient);
router.get("/:id", client.byIdClient);
router.put("/:id", client.updateClient);
router.delete("/:id", client.deleteClient);

export default router;