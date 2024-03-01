import {
  f64,
  i32,
  u32,
  bool,
  Struct,
  UnsizedType,
  Strings,
} from "../../deps/byte_type.ts";
import Enum from "./byte_type/Enum.ts";
import SizedStruct from "./byte_type/SizedStruct.ts";

export enum SizeType {
  Physical = 0,
  Logical = 1,
}

const Size = new Enum({
  Physical: {
    width: u32,
    height: u32,
  },
  Logical: {
    width: f64,
    height: f64,
  },
});

export enum PositionType {
  Physical = 0,
  Logical = 1,
}

const Position = new Enum({
  Physical: {
    width: i32,
    height: i32,
  },
  Logical: {
    width: f64,
    height: f64,
  },
});

export enum ThemeType {
  Light = 0,
  Dark = 1,
}

const Theme = new Enum({
  Light: {},
  Dark: {},
});

export enum WindowLevelType {
  AlwaysOnBottom = 0,
  Normal = 1,
  AlwaysOnTop = 2,
}

const WindowLevel = new Enum({
  AlwaysOnBottom: {},
  Normal: {},
  AlwaysOnTop: {},
});

// const String = new Struct({
//   pointer: u8,
//   length: u32,
// });

export const WindowAttributes = new SizedStruct({
  inner_size: Size,
  min_inner_size: Size,
  max_inner_size: Size,
  position: Position,
  resizable: bool,
  enabled_buttons: u32,
  title: new Strings.FixedLength(50),
  maximized: bool,
  visible: bool,
  transparent: bool,
  blur: bool,
  decorations: bool,
  preferred_theme: Theme,
  resize_increments: Size,
  content_protected: bool,
  window_level: WindowLevel,
  active: bool,
});

export type WindowAttributesType = typeof WindowAttributes extends Struct<
  Record<string, UnsizedType<unknown>>,
  infer V
>
  ? V
  : undefined;
