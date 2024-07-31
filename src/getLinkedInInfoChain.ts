import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GoogleSearchRunnable } from "./GoogleSearchRunnable";
import { StringOutputParser } from "@langchain/core/output_parsers";

dotenv.config();

const systemTemplate =
  "You are an AI assistant that helps find the most relevant LinkedIn profile for a company. When provided with the company name and a list of possible LinkedIn profile links, you will analyze and select the link that most likely corresponds to the company's official LinkedIn profile. Ensure the selection is accurate and based on relevance. Return only url without any other information. No explanation or any other information needed. The URL should lead to associated members page under that company, usually it look like this: https://www.linkedin.com/company/companyName/people/, if /people subpage is not there - you need to add it to the result url. Result url should be valid and should lead to real page";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{name}, {links}"],
]);

const parser = new StringOutputParser();

const runParseChatAnswer = (input: string): string => {
  console.log("ChatGPT response: ", input);
  try {
    return input
      .match(/\bhttps?:\/\/[^\s<>"']+/gi)[0]
      .replace(/^["'<]|[">]$/g, "");
  } catch (e) {
    return "";
  }
};

const groqModel = new ChatGroq({
  temperature: 0,
  maxTokens: 50,
});

const GoogleSearchRunnableInstance = new GoogleSearchRunnable();

export const chain = GoogleSearchRunnableInstance.pipe(promptTemplate)
  .pipe(groqModel)
  .pipe(parser)
  .pipe(runParseChatAnswer);
