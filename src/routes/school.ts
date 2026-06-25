import { Router } from "express";
import { getSchoolProfile } from "../controllers/schoolController";

const router = Router();

router.get("/:schoolCode", getSchoolProfile);

export default router