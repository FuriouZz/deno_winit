# Deno + Winit

winit binding for deno

### Example

```ts
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
```

## Related

* [winit](https://github.com/rust-windowing/winit)

## Inspiration

* [deno_sdl2](https://github.com/littledivy/deno_sdl2/) sdl2 binding
* [pane](https://github.com/denosaurs/pane) former winit binding
