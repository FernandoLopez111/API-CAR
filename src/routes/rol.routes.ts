import {} from 'express'
import { Router } from "express";
import RoleController from "../controllers/rol.controller";
const router = Router()
const rol = RoleController
router.get('/', rol.listRoles)
router.post('/', rol.createRol)
router.put('/:id', rol.modifyRol)
router.get('/:id', rol.getId)
router.delete('/:id', rol.deleteRol)
export default router