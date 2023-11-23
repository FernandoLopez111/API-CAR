import { Router } from "express";
import UsersController from "../controllers/user.controller";
import { ValidateToken } from "../jwt/tokenvalido";

const router = Router();
const user = UsersController;

router.get("/",ValidateToken ,user.listUser);
//router.get("/rol/:id", user.getRol);
router.post("/",  ValidateToken,user.createUser);
router.get("/:id",ValidateToken, user.byIdUser);
router.put("/:id",ValidateToken, user.updateUser);
router.delete("/:id", ValidateToken, user.deleteUser);
export default router;