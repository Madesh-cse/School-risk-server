import { Request, Response } from "express";
import SchoolReport from "../models/SchoolReport";

export const getDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reports = await SchoolReport.find();

    if (!reports.length) {
      res.status(200).json({
        totalSchools: 0,
        totalEnrollment: 0,
        averageAttendance: 0,
        onTrack: 0,
        atRisk: 0,
        behind: 0,
      });
      return;
    }

    const totalSchools = reports.length;

    const totalEnrollment = reports.reduce(
      (sum, report) => sum + (report.enrollment || 0),
      0,
    );

    const averageAttendance =
      reports.reduce((sum, report) => sum + (report.attendanceRate || 0), 0) /
      totalSchools;

    const onTrack = reports.filter(
      (report) => report.riskStatus === "On Track",
    ).length;

    const atRisk = reports.filter(
      (report) => report.riskStatus === "At Risk",
    ).length;

    const behind = reports.filter(
      (report) => report.riskStatus === "Behind",
    ).length;

    res.status(200).json({
      totalSchools,
      totalEnrollment,
      averageAttendance: Number(averageAttendance.toFixed(2)),
      onTrack,
      atRisk,
      behind,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

// Get controller of District Performance

export const getDistrictPerformance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const districtData = await SchoolReport.aggregate([
      {
        $group: {
          _id: "$district",
          averageAttendance: {
            $avg: "$attendanceRate",
          },
          totalSchools: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          district: "$_id",
          averageAttendance: {
            $round: ["$averageAttendance", 2],
          },
          totalSchools: 1,
        },
      },
      {
        $sort: {
          averageAttendance: -1,
        },
      },
    ]);

    res.status(200).json(districtData);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch district performance",
    });
  }
};

// Recent Envidence Controller
export const getRecentEvidence = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;

    const skip = (page - 1) * limit;

    const filter = {
      projectConducted: "Yes",
    };

    const totalRecords =
      await SchoolReport.countDocuments(filter);

    const evidence = await SchoolReport.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .select(
        "schoolName schoolCode district block reportingMonth evidenceSubmitted projectConducted"
      );

    res.status(200).json({
      success: true,
      data: evidence,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(
          totalRecords / limit
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch evidence",
    });
  }
};

// Reginol based Controller
export const getDistrictCoverage = async (
  req: Request,
  res: Response
) => {
  try {
    const districts =
      await SchoolReport.aggregate([
        {
          $group: {
            _id: "$district",

            schools: {
              $sum: 1,
            },

            enrollment: {
              $sum: "$enrollment",
            },
          },
        },
      ]);

    res.json(districts);
  } catch (error) {
    res.status(500).json({
      message: "Failed",
    });
  }
};
