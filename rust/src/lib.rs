use winit::{
    dpi::LogicalSize,
    event::{Event, WindowEvent},
    event_loop::EventLoop,
    window::WindowBuilder,
};

mod ffi;
use ffi::event::Event as FFIEvent;
use ffi::window_event::WindowEvent as FFIWindowEvent;

#[no_mangle]
pub extern "C" fn poll_events(callback: extern "C" fn(&FFIEvent)) {
    let event_loop = EventLoop::new().unwrap();
    let _window = WindowBuilder::new()
        .with_title("My Window")
        .with_inner_size(LogicalSize::new(800, 600))
        .build(&event_loop)
        .unwrap();

    let _ = event_loop.run(|event, _target| match event {
        Event::WindowEvent {
            event:
                WindowEvent::CursorEntered { .. }
                | WindowEvent::CursorLeft { .. }
                | WindowEvent::CursorMoved { .. }
                | WindowEvent::Moved(..)
                | WindowEvent::CloseRequested
                | WindowEvent::RedrawRequested
                | WindowEvent::MouseInput { .. },
            ..
        } => {
            let e: FFIEvent = event.into();
            // println!("{:?}", e);
            callback(&e);
        }
        // Event::WindowEvent {
        //     event: WindowEvent::Moved(..),
        //     ..
        // } => {
        //     let e: FFIEvent = event.into();
        //     // println!("{:?}", std::mem::size_of_val(&e));
        //     callback(&e);
        // }
        _ => {}
    });
}
