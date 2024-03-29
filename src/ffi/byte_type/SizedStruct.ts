import { SizedType, Options } from "../../../deps/byte_type.ts";
import type { ISizedStructSchema, ISizedStructType, ISizedStructFields } from "./types.ts";
import { createFields, getBiggestAlignment, getSizeAndOffsets } from "./utils/struct.ts";

export default class SizedStruct<
  T extends ISizedStructSchema,
  V extends ISizedStructType<T> = ISizedStructType<T>
> extends SizedType<V> {
  #fields: ISizedStructFields;
  #offsets: number[];

  constructor(schema: T, byteAlignment?: number) {
    const fields = createFields(schema);
    byteAlignment = byteAlignment ?? getBiggestAlignment(schema);
    const { offsets, size } = getSizeAndOffsets(fields, byteAlignment);

    super(size, byteAlignment);

    this.#fields = fields;
    this.#offsets = offsets;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const obj: Record<string | symbol, unknown> = {};
    if (this.#fields.length === 0) return obj as V;

    const _options = { byteOffset: 0 };

    for (let i = 0; i < this.#fields.length; i++) {
      const [key, type] = this.#fields[i];
      _options.byteOffset = this.#offsets[i];
      _options.byteOffset += options.byteOffset;
      obj[key] = type.readPacked(dt, _options);
    }

    return obj as V;
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 }
  ): void {
    if (this.#fields.length === 0) return;

    const _options = { byteOffset: 0 };

    for (let i = 0; i < this.#fields.length; i++) {
      const [key, type] = this.#fields[i];
      _options.byteOffset = this.#offsets[i];
      _options.byteOffset += options.byteOffset;
      type.writePacked(value[key], dt, _options);
    }
  }
}
