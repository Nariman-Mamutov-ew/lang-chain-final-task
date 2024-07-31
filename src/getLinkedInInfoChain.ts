import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { GoogleSearchRunnable } from "./GoogleSearchRunnable";

dotenv.config();

const systemTemplate =
  "You are an AI assistant that helps find the most relevant LinkedIn profile for a company. When provided with the company name and a list of possible LinkedIn profile links, you will analyze and select the link that most likely corresponds to the company's official LinkedIn profile. Please ensure the selection is accurate and based on relevance.";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{name}, {links}"],
]);

const parser = new StringOutputParser();

const runParseChatAnswer = (input: string): string => {
  console.log("ChatGPT response: ", input);
  try {
    return input.match(/\bhttps?:\/\/\S+[^.,!?\"'\s]/gi)[0];
  } catch (e) {
    return "";
  }
};

const model = new ChatOpenAI({ model: "gpt-3.5-turbo-0125", temperature: 0 });

const GoogleSearchRunnableInstance = new GoogleSearchRunnable();

export const chain = GoogleSearchRunnableInstance.pipe(promptTemplate)
  .pipe(model)
  .pipe(parser)
  .pipe(runParseChatAnswer);
