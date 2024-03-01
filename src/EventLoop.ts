import { EventLayout, Event } from "./ffi/events.ts";
import winit from "./winit.ts";
import { PointerSymbol } from "./constants.ts";

export default class EventLoop {
  [PointerSymbol]: Deno.PointerValue<unknown>;
  #callback?: Deno.UnsafeCallback<{ parameters: ["pointer"]; result: "void" }>;
  #released = false;

  constructor() {
    const ptr = winit.lib.create_event_loop();
    this[PointerSymbol] = ptr;
  }

  get released() {
    return this.#released;
  }

  pollEvents(): AsyncGenerator<Event>;
  pollEvents(cb: (e: Event) => void): void;
  pollEvents(cb?: (e: Event) => void) {
    return cb ? this.#runOnDemand(cb) : this.#pumpEvents();
  }

  #runOnDemand(cb: (e: Event) => void) {
    if (this.#released) {
      throw new Error("EventLoop has been released");
    }

    const callback = new Deno.UnsafeCallback(
      {
        parameters: ["pointer"],
        result: "void",
      },
      (e) => {
        if (e === null) return;

        try {
          const view = new Deno.UnsafePointerView(e);
          const event = EventLayout.read(view as unknown as DataView);
          cb(event);
        } catch (err) {
          console.error("Failed to read event");
          console.error(err);
        }
      }
    );

    winit.lib.event_loop_run_on_demand(this[PointerSymbol], callback.pointer);
    callback.close();
  }

  async *#pumpEvents() {
    if (this.#released) {
      throw new Error("EventLoop has been released");
    }

    const events: Event[] = [];

    if (!this.#callback) {
      this.#callback = new Deno.UnsafeCallback(
        {
          parameters: ["pointer"],
          result: "void",
        },
        (e) => {
          if (e === null) return;

          try {
            const view = new Deno.UnsafePointerView(e);
            const event = EventLayout.read(view as unknown as DataView);
            events.push(event);
          } catch (err) {
            console.error("Failed to read event");
            console.error(err);
          }
        }
      );
    }

    for (;;) {
      winit.lib.event_loop_pump_events(
        this[PointerSymbol],
        this.#callback.pointer
      );

      while (events.length > 0) {
        yield events.shift()!;
      }

      // Perform microtask
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    }
  }

  dispose() {
    if (this.#released) return;
    this.#released = true;
    this.#callback?.close();
    winit.lib.release_event_loop(this[PointerSymbol]);
    this[PointerSymbol] = null;
  }
}
