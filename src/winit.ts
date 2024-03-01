type Lib = ReturnType<typeof _createLib>;

function _createLib() {
  return Deno.dlopen(Deno.cwd() + "/rust/target/debug/libwinit.dylib", {
    create_event_loop: { parameters: [], result: "pointer" },
    release_event_loop: { parameters: ["pointer"], result: "void" },
    create_window: { parameters: ["pointer"], result: "pointer" },
    close_window: { parameters: ["pointer"], result: "void" },
    get_window_id: { parameters: ["pointer"], result: "u32" },
    set_window_title: { parameters: ["pointer", "buffer", "usize"], result: "void" },
    event_loop_run_on_demand: { parameters: ["pointer", "function"], result: "void",  },
    event_loop_pump_events: { parameters: ["pointer", "function"], result: "void",  },
  });
}

class Winit {
  #lib?: Lib;

  get lib() {
    if (!this.#lib) this.#lib = _createLib();
    return this.#lib.symbols;
  }

  close() {
    this.#lib?.close();
    this.#lib = undefined;
  }
}

const winit = new Winit();
export default winit;
