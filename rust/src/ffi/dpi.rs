pub type Vector2<T> = [T; 2];

#[derive(Clone)]
#[repr(C)]
pub enum Size {
    Physical(Vector2<u32>),
    Logical(Vector2<f64>),
}

#[derive(Clone)]
#[repr(C)]
pub enum Position {
    Physical(Vector2<i32>),
    Logical(Vector2<f64>),
}

impl From<Size> for winit::dpi::Size {
    fn from(value: Size) -> Self {
        match value {
            Size::Physical(s) => Self::Physical(winit::dpi::PhysicalSize::new(s[0], s[1])),
            Size::Logical(s) => Self::Logical(winit::dpi::LogicalSize::new(s[0], s[1])),
        }
    }
}

impl From<winit::dpi::Size> for Size {
    fn from(value: winit::dpi::Size) -> Self {
        match value {
            winit::dpi::Size::Physical(s) => Self::Physical([s.width, s.height]),
            winit::dpi::Size::Logical(s) => Self::Logical([s.width, s.height]),
        }
    }
}

impl From<Position> for winit::dpi::Position {
    fn from(value: Position) -> Self {
        match value {
            Position::Physical(s) => Self::Physical(winit::dpi::PhysicalPosition::new(s[0], s[1])),
            Position::Logical(s) => Self::Logical(winit::dpi::LogicalPosition::new(s[0], s[1])),
        }
    }
}

impl From<winit::dpi::Position> for Position {
    fn from(value: winit::dpi::Position) -> Self {
        match value {
            winit::dpi::Position::Physical(s) => Self::Physical([s.x, s.y]),
            winit::dpi::Position::Logical(s) => Self::Logical([s.x, s.y]),
        }
    }
}
