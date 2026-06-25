import { Request, Response } from "express";
import SchoolReport from "../models/SchoolReport";

export const getFinalReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalSchools =
      await SchoolReport.countDocuments();

    const totalEnrollment = await SchoolReport.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$enrollment",
          },
        },
      },
    ]);

    const averageAttendance = await SchoolReport.aggregate([
      {
        $group: {
          _id: null,
          average: {
            $avg: "$attendanceRate",
          },
        },
      },
    ]);

    const projectsConducted =
      await SchoolReport.countDocuments({
        projectConducted: "Yes",
      });

    const evidenceSubmitted =
      await SchoolReport.countDocuments({
        evidenceSubmitted: "Yes",
      });

    const riskBreakdown = await SchoolReport.aggregate([
      {
        $group: {
          _id: "$riskStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalStudents =
      totalEnrollment[0]?.total || 0;

    const avgAttendance = Number(
      averageAttendance[0]?.average?.toFixed(1) || 0
    );

    const criticalCount =
      riskBreakdown.find(
        (r) => r._id === "Critical"
      )?.count || 0;

    const atRiskCount =
      riskBreakdown.find(
        (r) => r._id === "At Risk"
      )?.count || 0;

    const onTrackCount =
      riskBreakdown.find(
        (r) => r._id === "On Track"
      )?.count || 0;

    const summary = `
The NGO currently monitors ${totalSchools} schools serving ${totalStudents} students.
Average attendance across all schools is ${avgAttendance}%.

A total of ${projectsConducted} schools have conducted project-based learning activities,
while ${evidenceSubmitted} schools have submitted supporting evidence.

Risk analysis shows ${onTrackCount} schools are On Track,
${atRiskCount} schools are At Risk,
and ${criticalCount} schools are in Critical status.

Priority attention should be given to high-risk schools to improve attendance,
project implementation, and evidence submission rates.
    `.trim();

    res.status(200).json({
      totalSchools,
      totalEnrollment: totalStudents,
      averageAttendance: avgAttendance,
      projectsConducted,
      evidenceSubmitted,
      riskBreakdown,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate report",
    });
  }
};