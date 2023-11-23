import { Router } from "express";
import ClientsController from "../controllers/client.controller";
import { ValidateToken } from "../jwt/tokenvalido";

const router = Router();
const client = ClientsController;

router.get("/",ValidateToken, client.listClient);
router.get("/car/:id",ValidateToken, client.getCar);
router.post("/",ValidateToken, client.createClient);
router.get("/:id",ValidateToken, client.byIdClient);
router.put("/:id",ValidateToken, client.updateClient);
router.delete("/:id",ValidateToken, client.deleteClient);

export default router;