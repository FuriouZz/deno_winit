import { f64, u32 } from "../../../deps/byte_type.ts";
import Enum from "./Enum.ts";
import { assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts";

enum WindowEvent {
  CursorEntered = 0x02,
  CursorMoved = 0x03,
}

enum Event {
  WindowEvent = 0x05,
}

Deno.test("enum", () => {
  const buffer = new ArrayBuffer(32);
  const dt = new DataView(buffer);

  const event = new Enum({
    [WindowEvent.CursorEntered]: {
      device_id: u32,
    },
    [WindowEvent.CursorMoved]: {
      device_id: u32,
      position: {
        x: f64,
        y: f64,
      },
    },
  });

  assertEquals(event.byteSize, 32);
  assertEquals(event.byteAlignment, 8);

  event.write(
    {
      type: WindowEvent.CursorMoved,
      device_id: 36,
      position: { x: 102.5, y: 30.7384 },
    },
    dt
  );

  assertEquals(event.read(dt), {
    type: WindowEvent.CursorMoved,
    device_id: 36,
    position: { x: 102.5, y: 30.7384 },
  });

  event.write(
    {
      type: WindowEvent.CursorEntered,
      device_id: 20,
    },
    dt
  );

  assertEquals(event.read(dt), {
    type: WindowEvent.CursorEntered,
    device_id: 20,
  });
});

Deno.test("sub enum", () => {
  const buffer = new ArrayBuffer(48);
  const dt = new DataView(buffer);

  const event = new Enum({
    [Event.WindowEvent]: {
      window_id: u32,
      event: new Enum({
        [WindowEvent.CursorEntered]: {
          device_id: u32,
        },
        [WindowEvent.CursorMoved]: {
          device_id: u32,
          position: {
            x: f64,
            y: f64,
          },
        },
      }),
    },
  });

  event.write(
    {
      type: Event.WindowEvent,
      window_id: 11,
      event: {
        type: WindowEvent.CursorMoved,
        device_id: 36,
        position: {
          x: 102.5,
          y: 30.7384,
        },
      },
    },
    dt
  );

  assertEquals(event.read(dt), {
    type: Event.WindowEvent,
    window_id: 11,
    event: {
      type: WindowEvent.CursorMoved,
      device_id: 36,
      position: {
        x: 102.5,
        y: 30.7384,
      },
    },
  });
});
