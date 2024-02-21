import { f64, i32, u32 } from "../../deps/byte_type.ts";
import Enum from "../byte_type/Enum.ts";

export enum WindowEventType {
  CloseRequested = 0x00,
  Moved = 0x01,
  CursorEntered = 0x02,
  CursorLeft = 0x03,
  CursorMoved = 0x04,
  RedrawRequested = 0x05,
  MouseInput = 0x06,
}

export const WindowEvent = new Enum(
  {
    [WindowEventType.CloseRequested]: {},
    [WindowEventType.Moved]: {
      position: {
        x: i32,
        y: i32,
      },
    },
    [WindowEventType.CursorEntered]: {
      device_id: u32,
    },
    [WindowEventType.CursorLeft]: {
      device_id: u32,
    },
    [WindowEventType.CursorMoved]: {
      device_id: u32,
      position: {
        x: f64,
        y: f64,
      },
    },
    [WindowEventType.RedrawRequested]: {},
    [WindowEventType.MouseInput]: {
      device_id: u32,
      state: u32,
      button: u32,
    },
  },
  { enumMap: WindowEventType }
);
