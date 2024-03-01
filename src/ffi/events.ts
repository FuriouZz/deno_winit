import { u32 } from "../../deps/byte_type.ts";
import Enum from "./byte_type/Enum.ts";
import { IEnumSchema } from "./byte_type/types.ts";
import { WindowEventLayout } from "./events/window_events.ts";

export enum EventType {
  WindowEvent = 0x00,
}

export const EventLayout = new Enum({
  [EventType.WindowEvent]: {
    window_id: u32,
    event: WindowEventLayout,
  },
});

export type Event = typeof EventLayout extends Enum<
  Record<EventType, IEnumSchema>,
  infer V
>
  ? V
  : undefined;

export {
  type WindowEvent,
  WindowEventType,
  WindowEventLayout,
} from "./events/window_events.ts";
