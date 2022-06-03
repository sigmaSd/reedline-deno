import { ReedLine } from "./reedline.ts";

const rl = await ReedLine.new();

while (true) {
  const line = await rl.readLine();
  if (line === null) {
    break;
  }
  console.log(line);
}
