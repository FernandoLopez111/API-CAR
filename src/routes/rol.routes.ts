import {} from 'express'
import { Router } from "express";
import RoleController from "../controllers/rol.controller";
import { ValidateToken } from '../jwt/tokenvalido';
const router = Router()
const rol = RoleController
router.get('/',ValidateToken, rol.listRoles)
router.post('/',ValidateToken, rol.createRol)
router.put('/:id',ValidateToken, rol.modifyRol)
router.get('/:id',ValidateToken, rol.getId)
router.delete('/:id',ValidateToken, rol.deleteRol)
export default router