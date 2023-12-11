import { Router } from "express";
import UsersController from "../controllers/user.controller";
import { ValidateToken } from "../jwt/tokenvalido";

const router = Router();
const user = UsersController;

router.get("/", ValidateToken ,user.listUser);
//router.get("/rol/:id", user.getRol);
router.post("/", user.createUser);
router.get("/:id", user.byIdUser);
router.put("/:id", user.updateUser);
router.delete("/:id", ValidateToken, user.deleteUser);

export default router;