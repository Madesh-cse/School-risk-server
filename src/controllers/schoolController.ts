import { Request, Response} from "express"
import SchoolReport from "../models/SchoolReport"

export const getSchoolProfile = async (
  req: Request,
  res: Response
) => {

  try {

    const { schoolCode } = req.params;
    const school = await SchoolReport.findOne({
      schoolCode
    });

    if(!school){
      return res.status(404).json({
        success:false,
        message:"School not found"
      });

    }
    // Calculate dashboard metrics

    const grantCompliance =
      school.evidenceSubmitted === "Yes"
      ? 100
      : 0;

    const projectScore = school.projectConducted === "Yes"? 100: 0;
    const attendanceScore = school.attendanceRate;
    const pblIndex =
      (
        grantCompliance +
        projectScore +
        attendanceScore
      ) / 3;

    res.status(200).json({
      success:true,
      school:{
        id:school._id,
        schoolName:
        school.schoolName,
        schoolCode:
        school.schoolCode,
        district:
        school.district,
        block:
        school.block,
        enrollment:
        school.enrollment,
        attendanceRate:
        school.attendanceRate,
        projectConducted:
        school.projectConducted,
        evidenceSubmitted:
        school.evidenceSubmitted,
        riskStatus:
        school.riskStatus
      },

      performance:{
        grantCompliance,
        studentRetention:
        school.attendanceRate,
        pblIndex:
        Number(pblIndex.toFixed(1))
      },

      domains:{
        collaboration:
        school.projectConducted==="Yes"
        ?85
        :30,
        inquiry:
        school.evidenceSubmitted==="Yes"
        ?80
        :25,
        reflection:
        school.attendanceRate>75
        ?90
        :40,
        communityImpact:
        school.riskStatus==="Critical"
        ?30
        :70
      }
    });

  } catch(error:any){
    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};