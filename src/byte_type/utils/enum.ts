import EnumVariant from "../EnumVariant.ts";
import { IEnumSchema, IStructSchema } from "../types.ts";
import { getBiggestAlignment } from "./struct.ts";

export const createVariants = (variants: Record<string, IEnumSchema>) => {
  let byteSize = 0;
  const byteAlignment = getBiggestAlignment(variants);

  const structs: EnumVariant<IStructSchema>[] = Object.entries(variants).map(
    ([key, variant]) => {
      const v = new EnumVariant(variant, byteAlignment, Number(key));
      byteSize = Math.max(byteSize, v.byteSize);
      return v;
    }
  );

  return { byteSize, byteAlignment, structs };
};
