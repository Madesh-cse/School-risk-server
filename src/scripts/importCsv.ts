import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import dns from "dns";

import SchoolReport from "../models/SchoolReport";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const importFile = async (filePath: string): Promise<void> => {
  const records: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        records.push({
          reportingMonth: row["Reporting Month"],

          schoolName:
            row["What is the name of your school?"],

          schoolCode:
            row["What is your school's synthetic school code?"],

          district:
            row["What is the name of your district?"],

          block: row["Block Details"],

          projectConducted:
            row[
              "Was the PBL project conducted in your school this month?"
            ],

          evidenceSubmitted:
            row[
              "Was evidence submitted for the completed PBL project?"
            ],

          enrollment: Number(
            row[
              "Derived: Total enrollment across Classes 6-8"
            ] || 0
          ),

          attendanceRate:
            Number(
              row[
                "Derived: Overall PBL attendance rate"
              ] || 0
            ) * 100,

          riskStatus:
            row["Derived: Risk status"],
        });
      })
      .on("end", async () => {
        try {
          console.log(
            `Parsed ${records.length} records from ${filePath}`
          );

          if (records.length > 0) {
            console.log("Sample Record:");
            console.log(records[0]);
          }

          await SchoolReport.insertMany(records);

          console.log(
            `Imported ${records.length} records successfully`
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);

    console.log("MongoDB Connected");

    // Optional: remove existing data
    await SchoolReport.deleteMany({});

    const files = [
      "./data/PBL_School_Response_Data_July_2025.csv",
      "./data/PBL_School_Response_Data_August_2025.csv",
      "./data/PBL_School_Response_Data_September_2025.csv",
    ];

    for (const file of files) {
      if (fs.existsSync(file)) {
        await importFile(file);
      } else {
        console.warn(`File not found: ${file}`);
      }
    }

    const count = await SchoolReport.countDocuments();

    console.log(
      `\nImport completed successfully. Total records: ${count}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Import Failed:");
    console.error(error);

    process.exit(1);
  }
};

run();