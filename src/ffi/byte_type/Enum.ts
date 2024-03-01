import { SizedType, Options, u32 } from "../../../deps/byte_type.ts";
import EnumVariant from "./EnumVariant.ts";
import { IEnumSchema, IEnumType, ISizedStructSchema } from "./types.ts";
import { createVariants } from "./utils/enum.ts";

export default class Enum<
  T extends Record<string, IEnumSchema>,
  V extends IEnumType<T> = IEnumType<T>
> extends SizedType<V> {
  #structs: EnumVariant<ISizedStructSchema>[];

  constructor(
    schema: T,
  ) {
    const { structs, byteSize, byteAlignment } = createVariants(schema);
    super(byteSize, byteAlignment);
    this.#structs = structs;
  }

  getVariant<K extends keyof T>(variant: K): EnumVariant<T[K]> | undefined {
    return this.#structs.find((v) => v.tag === variant) as
      | EnumVariant<T[K]>
      | undefined;
  }

  readPacked(
    dt: DataView,
    options: Options | undefined = { byteOffset: 0 }
  ): V {
    const tag = u32.read(dt, { ...options });
    const variant = this.getVariant(tag as keyof T);
    if (!variant) throw new Error("Unknown variant");
    const value = variant.readPacked(dt, options);
    const type = variant.tag;
    return { ...value, type } as V
  }

  writePacked(value: V, dt: DataView, options?: Options | undefined): void {
    const tag = Number(value.type) as keyof T
    const variant = this.getVariant(tag);
    if (!variant) throw new Error("Unknown variant");
    variant.writePacked(value, dt, options);
  }
}
