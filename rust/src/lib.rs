use std::time::Duration;

use winit::{
    event::{Event, WindowEvent},
    event_loop::EventLoop,
    platform::{pump_events::EventLoopExtPumpEvents, run_on_demand::EventLoopExtRunOnDemand},
};

mod ffi;
use ffi::{event::Event as FFIEvent, helpers::hash};

#[no_mangle]
pub extern "C" fn create_event_loop() -> *mut EventLoop<()> {
    Box::into_raw(Box::new(EventLoop::new().unwrap()))
}

#[no_mangle]
pub extern "C" fn release_event_loop(event_loop_ptr: *mut EventLoop<()>) {
    let event_loop = unsafe {
        assert!(!event_loop_ptr.is_null());
        Box::from_raw(event_loop_ptr)
    };
    drop(event_loop);
}

#[no_mangle]
pub extern "C" fn event_loop_pump_events(
    event_loop_ptr: *mut EventLoop<()>,
    callback: extern "C" fn(FFIEvent),
) {
    let event_loop = unsafe {
        assert!(!event_loop_ptr.is_null());
        event_loop_ptr.as_mut().unwrap()
    };

    let timeout = Some(Duration::ZERO);
    let _ = event_loop.pump_events(timeout, |event, _target| match event {
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
            callback(e);
        }
        _ => {}
    });
}

#[no_mangle]
pub extern "C" fn event_loop_run_on_demand(
    event_loop_ptr: *mut EventLoop<()>,
    callback: extern "C" fn(FFIEvent),
) {
    let event_loop = unsafe {
        assert!(!event_loop_ptr.is_null());
        event_loop_ptr.as_mut().unwrap()
    };

    let _ = event_loop.run_on_demand(|event, _target| match event {
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
            callback(e);
        }
        _ => {}
    });
}

#[no_mangle]
pub extern "C" fn create_window(event_loop_ptr: *mut EventLoop<()>) -> *mut winit::window::Window {
    let event_loop = unsafe {
        assert!(!event_loop_ptr.is_null());
        event_loop_ptr.as_ref().unwrap()
    };
    let window =
        Box::new(winit::window::Window::new(&event_loop).expect("Failed to create window"));
    let ptr = Box::into_raw(window);
    ptr
}

#[no_mangle]
pub extern "C" fn close_window(window_ptr: *mut winit::window::Window) {
    let window = unsafe {
        assert!(!window_ptr.is_null());
        Box::from_raw(window_ptr)
    };
    drop(window);
}

#[no_mangle]
pub extern "C" fn get_window_id(window_ptr: *mut winit::window::Window) -> u32 {
    let window = unsafe {
        assert!(!window_ptr.is_null());
        window_ptr.as_ref().unwrap()
    };
    hash(window.id())
}

#[no_mangle]
pub extern "C" fn set_window_title(
    window_ptr: *mut winit::window::Window,
    title_buffer: *mut u8,
    title_size: usize,
) {
    let window = unsafe {
        assert!(!window_ptr.is_null());
        window_ptr.as_ref().unwrap()
    };
    let title = unsafe {
        assert!(!title_buffer.is_null());
        std::str::from_utf8(std::slice::from_raw_parts(title_buffer, title_size)).unwrap()
    };
    window.set_title(&title.to_string());
}
