# reedline-deno

https://github.com/nushell/reedline/ ffi deno wrapper

## Usage

```ts
import { ReedLine } from "https://deno.land/x/reedline_deno/reedline.ts";

const rl = await ReedLine.new();

while (true) {
  const line = rl.readLine();
  if (line === null) {
    break;
  }
  console.log(line);
}
```
