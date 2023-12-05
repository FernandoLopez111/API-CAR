import {} from "express";
import { Router } from "express";
import RoleController from "../controllers/rol.controller";
import { ValidateToken } from "../jwt/tokenvalido";

    const router = Router();
    const rol = RoleController;

    router.get("/", ValidateToken, rol.listRoles);
    router.post("/",  rol.createRol);
    router.put("/:id", ValidateToken, rol.modifyRol);
    router.get("/:id", ValidateToken, rol.getId);
    router.delete("/:id", ValidateToken, rol.deleteRol);

    // router.get("/", rol.listRoles);
    // router.post("/", rol.createRol);
    // router.put("/:id", rol.modifyRol);
    // router.get("/:id", rol.getId);
    // router.delete("/:id", rol.deleteRol);

export default router;
