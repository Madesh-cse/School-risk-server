import { Request, Response } from "express";
import SchoolReport from "../models/SchoolReport";

export const getRiskAnalysis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // For summary cards
    const reports = await SchoolReport.find(
      {},
      {
        riskStatus: 1,
        attendanceRate: 1,
      }
    );

    const onTrack = reports.filter(
      (r) => r.riskStatus === "On Track"
    ).length;

    const atRisk = reports.filter(
      (r) => r.riskStatus === "At Risk"
    ).length;

    const behind = reports.filter(
      (r) => r.riskStatus === "Behind"
    ).length;

    const critical = reports.filter(
      (r) => r.attendanceRate < 60
    ).length;

    // Paginated Schools
    const schools = await SchoolReport.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const totalSchools =
      await SchoolReport.countDocuments();

    // District Ranking
    const districts = await SchoolReport.aggregate([
      {
        $group: {
          _id: "$district",
          totalSchools: {
            $sum: 1,
          },
          averageAttendance: {
            $avg: "$attendanceRate",
          },
        },
      },
      {
        $sort: {
          averageAttendance: -1,
        },
      },
    ]);

    res.status(200).json({
      summary: {
        onTrack,
        atRisk,
        behind,
        critical,
      },

      schools,

      districts,

      distribution: [
        {
          name: "On Track",
          value: onTrack,
        },
        {
          name: "At Risk",
          value: atRisk,
        },
        {
          name: "Behind",
          value: behind,
        },
        {
          name: "Critical",
          value: critical,
        },
      ],

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(
          totalSchools / limit
        ),
        totalRecords: totalSchools,
        limit,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch risk analysis",
    });
  }
};

// Regional Risks
export const getRegionalRiskConcentration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const districts = await SchoolReport.aggregate([
      {
        $group: {
          _id: "$district",

          totalSchools: {
            $sum: 1,
          },

          critical: {
            $sum: {
              $cond: [
                { $lt: ["$attendanceRate", 60] },
                1,
                0,
              ],
            },
          },

          atRisk: {
            $sum: {
              $cond: [
                { $eq: ["$riskStatus", "At Risk"] },
                1,
                0,
              ],
            },
          },

          behind: {
            $sum: {
              $cond: [
                { $eq: ["$riskStatus", "Behind"] },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $sort: {
          critical: -1,
        },
      },
    ]);

    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch regional risk data",
    });
  }
};