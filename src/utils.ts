export function encode<T>(data: T): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(data) + "\0");
}

export function decode<T>(ptr: Deno.PointerValue): T {
  if (!ptr) throw new Error("tried to decode null ptr: " + ptr);
  // ptr is a cstring
  const cstr = new Deno.UnsafePointerView(ptr).getCString();
  return JSON.parse(cstr);
}
