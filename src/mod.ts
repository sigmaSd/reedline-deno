import { plug } from "./deps.ts";
import { decode, encode } from "./utils.ts";

interface ReedLineApi extends Deno.ForeignLibraryInterface {
  create: { parameters: never[]; result: "pointer" };
  read_line: {
    parameters: ["pointer", "buffer"];
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
      rl: Deno.PointerValue;
    },
  ) {
    this.#lib = lib;
    this.#rl = rl;
  }
  static async create() {
    const name = "reedline_rust";
    const version = "0.17.0";
    const url =
      `https://github.com/sigmaSd/reedline-deno/releases/download/${version}`;

    const lib = await plug.dlopen(
      {
        name,
        url: Deno.env.get("RUST_LIB_PATH") || url,
        suffixes: {
          darwin: {
            aarch64: "_aarch64.dylib",
            x86_64: "_x86_64.dylib",
          },
        },
      },
      {
        create: { parameters: [], result: "pointer" },
        read_line: {
          parameters: ["pointer", "buffer"],
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
