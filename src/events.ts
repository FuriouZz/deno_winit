import { u32 } from "../deps/byte_type.ts";
import Enum from "./byte_type/Enum.ts";
import { WindowEvent } from "./events/window_events.ts";

export enum EventType {
  WindowEvent = 0x00,
}

export const Event = new Enum(
  {
    [EventType.WindowEvent]: {
      window_id: u32,
      event: WindowEvent,
    },
  },
  { enumMap: EventType}
);
