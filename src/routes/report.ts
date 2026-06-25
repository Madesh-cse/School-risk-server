import { Router } from "express";
import { getFinalReport } from "../controllers/reportController";

const router = Router();

router.get("/", getFinalReport);

export default router;