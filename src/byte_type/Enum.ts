import { SizedType, Options, u32 } from "../../deps/byte_type.ts";
import EnumVariant from "./EnumVariant.ts";
import { IEnumSchema, IEnumType, IStructSchema, IStructType } from "./types.ts";
import { createVariants } from "./utils/enum.ts";

export default class Enum<
  T extends Record<string, IEnumSchema>,
  V extends IEnumType<T> = IEnumType<T>
> extends SizedType<V> {
  #structs: EnumVariant<IStructSchema>[];
  #enumObject: Record<string, string | number> | undefined;

  constructor(
    schema: T,
    options?: {
      enumMap?: Record<string, number | string>;
    }
  ) {
    const { structs, byteSize, byteAlignment } = createVariants(schema);
    super(byteSize, byteAlignment);
    this.#structs = structs;
    this.#enumObject = options?.enumMap;
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

    let type: string | number = variant.tag;
    if (this.#enumObject) type = this.#enumObject[type];

    return { [type]: value } as V;
  }

  writePacked(value: V, dt: DataView, options?: Options | undefined): void {
    const tag = Number(Object.keys(value)[0]) as keyof T;
    const variant = this.getVariant(tag);
    if (!variant) throw new Error("Unknown variant");
    variant.writePacked(value[tag] as IStructType<unknown>, dt, options);
  }
}
