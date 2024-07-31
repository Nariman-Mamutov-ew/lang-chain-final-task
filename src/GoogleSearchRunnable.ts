import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";
import dotenv from "dotenv";

import type { Company, CompanyInfo } from "./types";

dotenv.config();

const googleSearch = new GoogleCustomSearch({
  apiKey: process.env.GOOGLE_SEARCH_API_KEY,
  googleCSEId: process.env.GOOGLECSEID,
});

export class GoogleSearchRunnable extends Runnable<Company, CompanyInfo, RunnableConfig> {
  async invoke(input: Company, config?: RunnableConfig): Promise<CompanyInfo> {
    try {
      const searchResults = await googleSearch.invoke(`${input.name} site:linkedin.com`);
      const parsedSearchResults: Array<{ link: string }> = JSON.parse(searchResults);
      const links = parsedSearchResults.map((item) => item.link);
      console.log("Google search links: ", links);
      const result: CompanyInfo = {
        name: input.name,
        links,
      };

      return result;
    } catch (error) {
      console.error("Error during Google search:", error);
      throw new Error("Failed to perform Google search");
    }
  }

  get lc_namespace(): string[] {
    return ["GoogleSearchRunnable"];
  }
}
