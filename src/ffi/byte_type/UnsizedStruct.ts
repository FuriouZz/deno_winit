import { UnsizedType, Struct } from "../../../deps/byte_type.ts";
import type { IUnsizedStructSchema, IUnsizedStructFields, UnsizedStructType, UnsizedStructValue } from "./types.ts";

const createFields = (schema: IUnsizedStructSchema) => {
  const getType = (
    key: string,
    value: unknown
  ): [string, UnsizedType<unknown>] => {
    let type: UnsizedType<unknown> | undefined = undefined;

    if (value instanceof UnsizedType) {
      type = value;
    } else if (typeof value === "object" && value !== null) {
      const s = value as IUnsizedStructSchema;
      type = new UnsizedStruct(s);
    }

    if (!type) throw new Error("Unsupported type");
    return [key, type];
  };

  const fields: IUnsizedStructFields = Object.entries(schema).map((entry) =>
    getType(...entry)
  );

  return fields;
};

export default class UnsizedStruct<
  T extends IUnsizedStructSchema
> extends Struct<
  UnsizedStructType<T>,
  UnsizedStructValue<UnsizedStructType<T>>
> {
  constructor(schema: T) {
    const fields = createFields(schema);
    super(Object.fromEntries(fields) as UnsizedStructType<T>);
  }
}
