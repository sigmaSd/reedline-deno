import { Prompt, ReedLine, Signal } from "./mod.ts";

declare module "./mod.ts" {
  interface ReedLine {
    question: (query: string, prompt?: Prompt) => Promise<Signal>;
  }
}

ReedLine.prototype.question = async function (
  query: string,
  prompt?: Prompt,
): Promise<Signal> {
  console.log(query);
  return await this.readLine(prompt);
};
