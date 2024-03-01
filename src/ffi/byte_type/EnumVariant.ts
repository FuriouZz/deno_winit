import { u32, Options } from "../../../deps/byte_type.ts";
import SizedStruct from "./SizedStruct.ts";
import { IEnumSchema, ISizedStructType } from "./types.ts";

export default class EnumVariant<
  T extends IEnumSchema,
  V extends ISizedStructType<T> = ISizedStructType<T>
> extends SizedStruct<T, V> {
  #tag: number;

  constructor(schema: T, byteAlignment: number, type: number) {
    super(
      {
        tag: u32,
        payload: schema,
      } as unknown as T,
      byteAlignment
    );
    this.#tag = type;
  }

  get tag() {
    return this.#tag;
  }

  readPacked(dt: DataView, options?: Options): V {
    const obj = super.readPacked(dt, options) as unknown as { payload: V };
    return obj.payload;
  }

  writePacked(value: V, dt: DataView, options?: Options): void {
    return super.writePacked(
      {
        tag: this.#tag,
        payload: value,
      } as unknown as V,
      dt,
      options
    );
  }
}
