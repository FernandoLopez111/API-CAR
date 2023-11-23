import { Router } from "express";
import CarWashController from "../controllers/carwash.controller";
import { ValidateToken } from "../jwt/tokenvalido";

const router = Router();
const service = CarWashController;

router.get("/",ValidateToken,  service.listCarwash);
router.post("/",ValidateToken, service.createCarwash);
router.get("/:id",ValidateToken, service.byIdService);
router.put("/:id",ValidateToken, service.updateService);
router.delete("/:id",ValidateToken, service.deleteService);
export default router;