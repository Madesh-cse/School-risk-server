import { Router} from "express";
import { getRiskSummary } from "../controllers/summary";

const router = Router();

router.get("/", getRiskSummary);

export default router;