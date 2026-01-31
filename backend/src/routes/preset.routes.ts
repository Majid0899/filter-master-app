import { Router } from "express";
import { handleAllPreset,handleDefaultPreset,handleSetPreset,handleUpdatePreset,handleDeletePreset } from "../controllers/preset.controller";


const router=Router()

router.get("/",handleAllPreset)
router.get("/default",handleDefaultPreset)
router.post("/",handleSetPreset)
router.put("/:id",handleUpdatePreset)
router.delete("/:id",handleDeletePreset)


export default router