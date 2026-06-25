import { Request, Response } from "express";
import SchoolReport from "../models/SchoolReport";

export const getRiskSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const summary = await SchoolReport.aggregate([
      {
        $group: {
          _id: "$riskStatus",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch summary",
    });
  }
};