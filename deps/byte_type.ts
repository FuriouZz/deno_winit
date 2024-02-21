import { Unsized } from "https://deno.land/x/byte_type@0.3.0/src/types/unsized.ts";

export {
  Struct,
  SizedType,
  UnsizedType,
  I8,
  I16,
  I32,
  I64,
  U8,
  U16,
  U32,
  U64,
  F32,
  F64,
  u8,
  u16,
  u32,
  u64,
  f64,
  i32,
  getBiggestAlignment,
  type Options,
} from "https://deno.land/x/byte_type@0.3.0/mod.ts";

export type { Unsized } from "https://deno.land/x/byte_type@0.3.0/src/types/unsized.ts";

export type InnerType<T> = T extends Unsized<infer I> ? I : never;
