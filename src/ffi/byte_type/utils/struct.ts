import { SizedType } from "../../../../deps/byte_type.ts";
import SizedStruct from "../SizedStruct.ts";
import { ISizedStructFields, ISizedStructSchema } from "../types.ts";

export const createFields = (schema: ISizedStructSchema) => {
  const getType = (
    key: symbol | string,
    value: unknown
  ): [string | symbol, SizedType<unknown>] => {
    let type: SizedType<unknown> | undefined = undefined;

    if (value instanceof SizedType) {
      type = value;
    } else if (typeof value === "object" && value !== null) {
      const s = value as ISizedStructSchema;
      type = new SizedStruct(s, getBiggestAlignment(s));
    }

    if (!type) throw new Error("Unsupported type");
    return [key, type];
  };

  const fields: ISizedStructFields = [
    ...Object.getOwnPropertySymbols(schema).map((sym) =>
      getType(sym, schema[sym])
    ),
    ...Object.entries(schema).map((entry) => getType(...entry)),
  ];

  return fields;
};

export const paddingNeededFor = (offset: number, alignment: number) => {
  const misalignment = offset % alignment;
  return misalignment > 0 ? alignment - misalignment : 0;
};

export const getSizeAndOffsets = (fields: ISizedStructFields, alignment: number) => {
  let offset = 0;
  const offsets: number[] = [];

  for (const [, type] of fields) {
    offset += paddingNeededFor(offset, alignment);
    offsets.push(offset);
    offset += type.byteSize;
  }

  const size = offset + paddingNeededFor(offset, alignment);
  return { offsets, size };
};

export const getBiggestAlignment = (schema: ISizedStructSchema) => {
  return Object.values(schema).reduce((biggest: number, entry) => {
    if (entry instanceof SizedType) {
      biggest = Math.max(biggest, entry.byteAlignment);
    } else if (typeof entry === "object" && entry !== null) {
      biggest = Math.max(biggest, getBiggestAlignment(entry));
    }
    return biggest;
  }, 0);
};
