import dotenv from "dotenv";
import express from "express";
import pLimit from "p-limit";

import { chain } from "./getLinkedInInfoChain";
import { readCSV, writeCSV } from "./utils";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.get("/process", async (req, res) => {
  try {
    const companies = await readCSV("./src/data/companies_nm.csv");

    const limit = pLimit(2);

    const results = await Promise.all(
      companies.map((company, index) =>
        limit(async () => {
          const response = await chain.invoke(company);
          console.log(
            `Number ${index + 1} of ${companies.length}.
            Company ${company.name} is done.`,
          );
          return {
            ...company,
            linkedinLink: response,
          };
        }),
      ),
    );

    await writeCSV("./src/data/processed_companies.csv", results);

    res.json(results);
  } catch (error) {
    console.error("Error during processing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
