import {
  InnerType,
  SizedType,
  Struct,
  UnsizedType,
} from "../../../deps/byte_type.ts";

export type ISizedStructSchema = {
  [K in string | symbol]: SizedType<unknown> | ISizedStructSchema;
};

export type ISizedStructType<T> = T extends ISizedStructSchema
  ? {
      [K in keyof T]: T[K] extends ISizedStructSchema
        ? ISizedStructType<T[K]>
        : InnerType<T[K]>;
    }
  : never;

export type ISizedStructFields = [string | symbol, SizedType<unknown>][];

export type IUnsizedStructSchema = {
  [K in string | symbol]: UnsizedType<unknown> | IUnsizedStructSchema;
};

export type UnsizedStructType<T extends IUnsizedStructSchema> = {
  [K in keyof T]: T[K] extends Record<string, UnsizedType<unknown>>
    ? Struct<T[K]>
    : T[K] extends UnsizedType<unknown>
    ? T[K]
    : never;
};

export type UnsizedStructValue<T extends Record<string, UnsizedType<unknown>>> =
  {
    [K in keyof T]: InnerType<T[K]>;
  };

export type IUnsizedStructFields = [string, UnsizedType<unknown>][];

export type IEnumSchema = ISizedStructSchema;

// export type IEnumType<T extends Record<string, IEnumSchema>> = {
//   [K in keyof T]?: ISizedStructType<T[K]>;
// };

export type IEnumType<
  T extends Record<string, IEnumSchema>,
  K extends keyof T = keyof T
> = ISizedStructType<T[K]> & { type: K };
