import { Plug } from "https://deno.land/x/plug@0.5.1/mod.ts";

interface ReedLineApi extends Deno.ForeignLibraryInterface {
  new: { parameters: never[]; result: "pointer" };
  read_line: {
    parameters: "pointer"[];
    result: "pointer";
    nonblocking: boolean;
  };
}

export class ReedLine {
  #lib;
  #rl;
  constructor(
    { lib, rl }: {
      lib: Deno.DynamicLibrary<ReedLineApi>;
      rl: bigint;
    },
  ) {
    this.#lib = lib;
    this.#rl = rl;
  }
  static async new() {
    const { url, policy } = (() => {
      const maybeDev = Deno.env.get("RUST_LIB_PATH");
      return maybeDev ? { url: maybeDev, policy: Plug.CachePolicy.NONE } : {
        url:
          "https://github.com/sigmaSd/reedline-deno/releases/download/0.8.0/",
        policy: Plug.CachePolicy.STORE,
      };
    })();

    const lib = await Plug.prepare({
      name: "reedline_rust",
      url,
      policy,
    }, {
      new: { parameters: [], result: "pointer" },
      read_line: {
        parameters: ["pointer", "pointer"],
        result: "pointer",
        nonblocking: true,
      },
    });
    const rl = lib.symbols.new();
    return new ReedLine({ lib, rl });
  }
  async readLine(prompt?: string) {
    const p = prompt ? new TextEncoder().encode(prompt + "\0") : null;

    const ptr = await this.#lib.symbols.read_line(this.#rl, p);
    if (ptr === 0n) {
      return null;
    }
    return new Deno.UnsafePointerView(ptr).getCString();
  }
}
