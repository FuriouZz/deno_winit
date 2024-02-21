use winit::event::Event as WinitEvent;

use super::{helpers::hash, window_event::WindowEvent};

#[derive(Debug)]
#[repr(C)]
pub enum Event {
    WindowEvent { window_id: u32, event: WindowEvent },
}

impl From<WinitEvent<()>> for Event {
    fn from(e: WinitEvent<()>) -> Self {
        match e {
            WinitEvent::WindowEvent { window_id, event } => Event::WindowEvent {
                window_id: hash(window_id),
                event: event.into(),
            },
            _ => todo!(),
        }
    }
}
