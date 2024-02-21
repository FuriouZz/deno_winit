import { InnerType, SizedType } from "../../deps/byte_type.ts";

export type IStructSchema = {
  [K in string | symbol]: SizedType<unknown> | IStructSchema;
};

export type IStructType<T> = T extends IStructSchema
  ? {
      [K in keyof T]: T[K] extends IStructSchema
        ? IStructType<T[K]>
        : InnerType<T[K]>;
    }
  : never;

export type IStructFields = [string | symbol, SizedType<unknown>][];

export type IEnumSchema = IStructSchema;

export type IEnumType<T extends Record<string, IEnumSchema>> = {
  [K in keyof T]?: IStructType<T[K]>;
};
