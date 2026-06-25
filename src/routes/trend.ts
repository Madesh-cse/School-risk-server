import { Router } from "express"
import { getMonthlyTrend } from "../controllers/trend"

const router = Router();

router.get("/", getMonthlyTrend);

export default router;