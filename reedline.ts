interface ReedLineApi extends Deno.ForeignLibraryInterface {
  new: { parameters: never[]; result: "pointer" };
  read_line: { parameters: "pointer"[]; result: "pointer" };
}

export class ReedLine {
  #lib: Deno.DynamicLibrary<ReedLineApi>;
  #rl: Deno.UnsafePointer;
  constructor() {
    this.#lib = Deno.dlopen(
      "TODO",
      {
        new: { parameters: [], result: "pointer" },
        read_line: { parameters: ["pointer"], result: "pointer" },
      },
    );
    this.#rl = this.#lib.symbols.new();
  }
  readLine(): string | null {
    const ptr = this.#lib.symbols.read_line(this.#rl);
    if (ptr.value === 0n) {
      return null;
    }
    return new Deno.UnsafePointerView(ptr).getCString();
  }
}
