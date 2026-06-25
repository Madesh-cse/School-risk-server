import { Schema, model } from "mongoose";

export interface ISchoolReport {
  reportingMonth: string;
  schoolName: string;
  schoolCode: string;
  district: string;
  block: string;
  projectConducted: string;
  evidenceSubmitted: string;
  enrollment: number;
  attendanceRate: number;
  riskStatus: string;
}

const SchoolReportSchema = new Schema<ISchoolReport>(
  {
    reportingMonth: {
      type: String,
      required: true,
    },

    schoolName: String,

    schoolCode: {
      type: String,
      index: true,
    },

    district: String,

    block: String,

    projectConducted: String,

    evidenceSubmitted: String,

    enrollment: Number,

    attendanceRate: Number,

    riskStatus: {
      type: String,
      enum: ["On Track", "Behind", "At Risk",  "Critical",],
    },
  },
  {
    timestamps: true,
  }
);

export default model<ISchoolReport>(
  "SchoolReport",
  SchoolReportSchema
);