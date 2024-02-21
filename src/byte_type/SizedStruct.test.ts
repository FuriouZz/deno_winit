import { f64, u32 } from "../../deps/byte_type.ts";
import SizedStruct from "./SizedStruct.ts";
import { assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts";

Deno.test("sized struct", () => {
  const buffer = new ArrayBuffer(24);
  const dt = new DataView(buffer);

  const myStruct = new SizedStruct({
    device_id: u32,
    position: {
      x: f64,
      y: f64,
    },
  });

  assertEquals(myStruct.byteSize, 24);
  assertEquals(myStruct.byteAlignment, 8);

  myStruct.write(
    {
      device_id: 36,
      position: {
        x: 102.5,
        y: 30.7384,
      },
    },
    dt
  );

  assertEquals(myStruct.read(dt), {
    device_id: 36,
    position: {
      x: 102.5,
      y: 30.7384,
    },
  });
});
