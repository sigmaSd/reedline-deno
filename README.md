# Reedline Deno

https://github.com/nushell/reedline/ deno ffi wrapper

## Usage

```ts
import { ReedLine } from "https://deno.land/x/reedline_deno@0.9.0/src/mod.ts";

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
```

## Development

**workflow:**

- `deno task example` should be used to test changes.

**design:**

- Try to mimic https://docs.rs/reedline/latest/reedline api as best as
  typescript allows.
