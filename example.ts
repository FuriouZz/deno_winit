import { Window, EventLoop } from "./mod.ts";

const eventLoop = new EventLoop();
const window = new Window(eventLoop, {
  title: "hello world",
});

for await (const event of eventLoop.pollEvents()) {
  window.onEvent(event);
  console.log(event);
  if (window.closed) break;
}
