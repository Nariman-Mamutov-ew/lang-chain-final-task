import fs from "fs";
import csv from "csv-parser";
import { createObjectCsvWriter } from "csv-writer";

import type { Company } from "./types";

export const readCSV = (filePath: string): Promise<Company[]> => {
  return new Promise((resolve, reject) => {
    const results: Company[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

export const writeCSV = (filePath: string, data: any[]): Promise<void> => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "name", title: "name" },
      { id: "link", title: "Link" },
      { id: "linkedinLink", title: "LinkedInLink" },
    ],
  });

  return csvWriter.writeRecords(data);
};
