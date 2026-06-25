import { Router} from "express"
import { getRiskAnalysis } from "../controllers/risk"
import { getRegionalRiskConcentration } from "../controllers/risk";

const router = Router();

router.get("/", getRiskAnalysis);

// Risk Reginol Router
router.get("/regional-risk", getRegionalRiskConcentration )

export default router;