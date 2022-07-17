import { ReedLine } from "./src/mod.ts";

const rl = await ReedLine.create();

while (true) {
  const line = await rl.readLine({
    render_prompt_left: "> ",
    render_prompt_right: "<",
  });
  if (line.signal === "CtrlC") {
    console.log("CtrlC");
    break;
  }
  if (line.signal === "CtrlD") {
    console.log("CtrlD");
    break;
  }
  console.log(line.value);
}

import {} from "./src/extra.ts";

const answer = await rl.question("What's up?", {
  render_prompt_left: "??> ",
  render_prompt_right: "<#",
});
console.log("You are: ", answer.value);
