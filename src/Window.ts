import EventLoop from "./EventLoop.ts";
import { PointerSymbol } from "./constants.ts";
import { WindowEventType, EventType, Event } from "./ffi/events.ts";
import winit from "./winit.ts";

const TEXT_ENCODER = new TextEncoder();

interface WindowAttributes {
  title: string;
}

export default class Window {
  [PointerSymbol]: Deno.PointerObject;
  #id: number;
  #title = "winit window";
  #closed = false;

  constructor(eventLoop: EventLoop, options?: Partial<WindowAttributes>) {
    const eventLoopPointer = eventLoop[PointerSymbol];
    const ptr = winit.lib.create_window(eventLoopPointer);

    if (ptr === null) {
      throw new Error("Fail to create window");
    }

    this[PointerSymbol] = ptr;
    this.#id = winit.lib.get_window_id(ptr);

    this.title = options?.title ?? "deno window";
  }

  get closed() {
    return this.#closed;
  }

  get title() {
    return this.#title;
  }

  set title(v) {
    this.#title = v;
    this.#setTitle();
  }

  #setTitle() {
    if (this.#closed) return;
    const text = TEXT_ENCODER.encode(this.#title);
    winit.lib.set_window_title(this[PointerSymbol], text, text.byteLength);
  }

  onEvent(e: Event) {
    if (e.type !== EventType.WindowEvent || e.window_id !== this.#id) return;
    const event = e.event;

    if (event.type === WindowEventType.CloseRequested) {
      this.dispose();
    }
  }

  dispose() {
    if (this.#closed) return;
    winit.lib.close_window(this[PointerSymbol]);
    this[PointerSymbol];
    this.#closed = true;
  }
}
