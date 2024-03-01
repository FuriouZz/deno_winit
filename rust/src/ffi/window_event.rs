use winit::event::{
    ElementState as WinitElementState, MouseButton as WinitMouseButton,
    WindowEvent as WinitWindowEvent,
};

use super::helpers::hash;

type Vector2<T> = [T; 2];

#[derive(Debug)]
#[repr(C)]
pub enum WindowEvent {
    CloseRequested,
    Moved {
        position: Vector2<i32>,
    },
    CursorEntered {
        device_id: u32,
    },
    CursorLeft {
        device_id: u32,
    },
    CursorMoved {
        device_id: u32,
        position: Vector2<f64>,
    },
    RedrawRequested,
    MouseInput {
        device_id: u32,
        state: ElementState,
        button: MouseButton,
    },
}

#[derive(Debug)]
#[repr(C)]
pub enum MouseButton {
    Left,
    Right,
    Middle,
    Back,
    Forward,
}

#[derive(Debug)]
#[repr(C)]
pub enum ElementState {
    Pressed = 1,
    Released = 0,
}

impl From<WinitWindowEvent> for WindowEvent {
    fn from(event: WinitWindowEvent) -> Self {
        match event {
            WinitWindowEvent::Moved(position) => WindowEvent::Moved {
                position: [position.x, position.y],
            },
            WinitWindowEvent::CloseRequested => WindowEvent::CloseRequested,
            WinitWindowEvent::CursorEntered { device_id } => WindowEvent::CursorEntered {
                device_id: hash(device_id),
            },
            WinitWindowEvent::CursorLeft { device_id } => WindowEvent::CursorLeft {
                device_id: hash(device_id),
            },
            WinitWindowEvent::CursorMoved {
                device_id,
                position,
            } => WindowEvent::CursorMoved {
                device_id: hash(device_id),
                position: [position.x, position.y],
            },
            WinitWindowEvent::RedrawRequested => WindowEvent::RedrawRequested,
            WinitWindowEvent::MouseInput {
                device_id,
                state,
                button,
            } => WindowEvent::MouseInput {
                device_id: hash(device_id),
                button: button.into(),
                state: state.into(),
            },
            _ => todo!(),
        }
    }
}

impl From<WinitMouseButton> for MouseButton {
    fn from(event: WinitMouseButton) -> Self {
        match event {
            WinitMouseButton::Left => MouseButton::Left,
            WinitMouseButton::Right => MouseButton::Right,
            WinitMouseButton::Middle => MouseButton::Middle,
            WinitMouseButton::Back => MouseButton::Back,
            WinitMouseButton::Forward => MouseButton::Forward,
            _ => todo!(),
        }
    }
}

impl From<WinitElementState> for ElementState {
    fn from(event: WinitElementState) -> Self {
        match event {
            WinitElementState::Pressed => ElementState::Pressed,
            WinitElementState::Released => ElementState::Released,
        }
    }
}
