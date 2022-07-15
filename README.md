# reedline-deno

https://github.com/nushell/reedline/ ffi deno wrapper

## Usage

```ts
import { ReedLine } from "https://deno.land/x/reedline_deno@0.8.0/reedline.ts";

const rl = await ReedLine.new();

while (true) {
  const line = await rl.readLine(); // custom prompt is also possible rl.readline("#> ")
  if (line === null) {
    break;
  }
  console.log(line);
}
```
