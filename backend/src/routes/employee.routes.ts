import { Router } from "express";
import { handleGetEmployee } from "../controllers/employee.controller";


const router=Router()

router.get("/",handleGetEmployee)

export default router


