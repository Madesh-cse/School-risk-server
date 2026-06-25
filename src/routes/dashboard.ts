import { Router} from "express"
import { getDashboard } from "../controllers/dashboard";
import { getDistrictPerformance } from "../controllers/dashboard";
import { getRecentEvidence } from "../controllers/dashboard";
import { getDistrictCoverage } from "../controllers/dashboard";

const router  = Router();

router.get("/", getDashboard);

router.get("/", (req, res) => {
  res.send("Dashboard Route Hit");
});

router.get(
  "/district-performance",
  getDistrictPerformance
);

router.get("/recent-evidence", getRecentEvidence);

router.get("/district-coverage", getDistrictCoverage);



export default router;