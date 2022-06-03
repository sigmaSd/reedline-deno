import { ReedLine } from "./reedline.ts";

const rl = new ReedLine();

while (true) {
  const line = rl.readLine();
  if (line === null) {
    break;
  }
  console.log(line);
}
