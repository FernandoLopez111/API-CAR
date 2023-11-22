import { Router } from "express";
import CarWashController from "../controllers/carwash.controller";

const router = Router();
const service = CarWashController;

router.get("/", service.listCarwash);
router.post("/", service.createCarwash);
router.get("/:id", service.byIdService);
router.put("/:id", service.updateService);
router.delete("/:id", service.deleteService);
export default router;