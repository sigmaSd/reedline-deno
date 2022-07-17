import { Plug } from "./deps.ts";
import { decode, encode } from "./utils.ts";

interface ReedLineApi extends Deno.ForeignLibraryInterface {
  create: { parameters: never[]; result: "pointer" };
  read_line: {
    parameters: "pointer"[];
    result: "pointer";
    nonblocking: boolean;
  };
}

export interface Prompt {
  render_prompt_left: string;
  render_prompt_right: string;
}

export interface Signal {
  signal: "CtrlC" | "CtrlD" | null;
  value: string | null;
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
  static async create() {
    const result = (() => {
      const maybeDev = Deno.env.get("RUST_LIB_PATH");
      return maybeDev ? { url: maybeDev, policy: Plug.CachePolicy.NONE } : {
        urls: {
          darwin: {
            aarch64:
              "https://github.com/sigmaSd/reedline-deno/releases/download/0.10.0/libreedline_rust_aarch64.dylib",
            x86_64:
              "https://github.com/sigmaSd/reedline-deno/releases/download/0.10.0/libreedline_rust_x86_64.dylib",
          },
          windows:
            "https://github.com/sigmaSd/reedline-deno/releases/download/0.10.0/reedline_rust.dll",
          linux:
            "https://github.com/sigmaSd/reedline-deno/releases/download/0.10.0/libreedline_rust.so",
        },
        policy: Plug.CachePolicy.STORE,
      };
    })();

    const name = "reedline_rust";
    const lib = await Plug.prepare(
      result.url
        ? { name, url: result.url, policy: result.policy }
        : { name, urls: result.urls!, policy: result.policy },
      {
        create: { parameters: [], result: "pointer" },
        read_line: {
          parameters: ["pointer", "pointer"],
          result: "pointer",
          nonblocking: true,
        },
      },
    );
    const rl = lib.symbols.create();
    return new ReedLine({ lib, rl });
  }
  async readLine(prompt?: Prompt): Promise<Signal> {
    const ptr = await this.#lib.symbols.read_line(
      this.#rl,
      prompt ? encode(prompt) : null,
    );
    const signal: "CtrlC" | "CtrlD" | { Success: string[] } = decode(ptr);
    if (signal == "CtrlC") {
      return {
        signal: "CtrlC",
        value: null,
      };
    }
    if (signal == "CtrlD") {
      return {
        signal: "CtrlD",
        value: null,
      };
    }
    return {
      signal: null,
      value: signal.Success[0],
    };
  }
}
