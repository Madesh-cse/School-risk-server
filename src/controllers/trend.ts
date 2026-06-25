import { Request, Response } from "express";
import SchoolReport from "../models/SchoolReport";

export const getMonthlyTrend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trend = await SchoolReport.aggregate([
      {
        $group: {
          _id: "$reportingMonth",

          averageAttendance: {
            $avg: "$attendanceRate",
          },

          totalEnrollment: {
            $sum: "$enrollment",
          },

          schoolCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json(trend);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trends",
    });
  }
};