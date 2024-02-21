import { Event } from "./src/events.ts";

function pollEvents(callback: (event: unknown) => void) {
  const onPollEvents = new Deno.UnsafeCallback(
    {
      parameters: ["pointer"],
      result: "void",
    },
    (e) => {
      if (e === null) return;

      try {
        const view = new Deno.UnsafePointerView(e);

        const event = Event.read(view as unknown as DataView);
        callback(event);
      } catch (err) {
        console.error("Failed to read event");
        console.error(err);
      }
    }
  );

  const lib = Deno.dlopen("./rust/target/debug/libwinit.dylib", {
    poll_events: { parameters: ["function"], result: "void" },
  });

  lib.symbols.poll_events(onPollEvents.pointer);
}

pollEvents(console.log);
