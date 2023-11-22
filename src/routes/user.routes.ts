import { Router } from "express";
import UsersController from "../controllers/user.controller";

const router = Router();
const user = UsersController;

router.get("/", user.listUser);
//router.get("/rol/:id", user.getRol);
router.post("/",  user.createUser);
router.get("/:id", user.byIdUser);
router.put("/:id", user.updateUser);
router.delete("/:id", user.deleteUser);
export default router;