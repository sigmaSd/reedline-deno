import { Plug } from "https://deno.land/x/plug@0.5.1/mod.ts";

interface ReedLineApi extends Deno.ForeignLibraryInterface {
  new: { parameters: never[]; result: "pointer" };
  read_line: { parameters: "pointer"[]; result: "pointer" };
}

export class ReedLine {
  #lib: Deno.DynamicLibrary<ReedLineApi>;
  #rl: Deno.UnsafePointer;
  constructor(
    { lib, rl }: {
      lib: Deno.DynamicLibrary<ReedLineApi>;
      rl: Deno.UnsafePointer;
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
          "https://github.com/sigmaSd/reedline-deno/releases/download/0.2.0/",
        policy: Plug.CachePolicy.STORE,
      };
    })();

    const lib = await Plug.prepare({
      name: "reedline_rust",
      url,
      policy,
    }, {
      new: { parameters: [], result: "pointer" },
      read_line: { parameters: ["pointer"], result: "pointer" },
    });
    const rl = lib.symbols.new();
    return new ReedLine({ lib, rl });
  }
  readLine(): string | null {
    const ptr = this.#lib.symbols.read_line(this.#rl);
    if (ptr.value === 0n) {
      return null;
    }
    return new Deno.UnsafePointerView(ptr).getCString();
  }
}
