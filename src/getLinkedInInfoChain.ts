import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { GoogleSearchRunnable } from "./GoogleSearchRunnable";

dotenv.config();

const systemTemplate = "Find the most relevant LinkedIn profile for the company from the following links:";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{name}, {links}"],
]);

const parser = new StringOutputParser();

const runParseChatAnswer = (input: string): string => {
  try {
    return input.match(/\bhttps?:\/\/\S+/gi)[0];
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
