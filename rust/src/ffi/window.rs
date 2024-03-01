use std::ffi::{c_char, CString};

use winit::window::WindowBuilder;

use super::dpi::{Position, Size};

#[derive(Clone)]
#[repr(C)]
pub enum WindowLevel {
    AlwaysOnBottom,
    Normal,
    AlwaysOnTop,
}

#[derive(Clone)]
#[repr(C)]
pub enum Theme {
    Light,
    Dark,
}

#[derive(Debug, Clone)]
#[repr(C)]
pub struct WindowAttributes {
    // pub inner_size: Option<Size>,
    // pub min_inner_size: Option<Size>,
    // pub max_inner_size: Option<Size>,
    // pub position: Option<Position>,
    pub resizable: bool,
    // pub enabled_buttons: winit::window::WindowButtons,
    // pub title: *const c_char,
    pub maximized: bool,
    pub visible: bool,
    pub transparent: bool,
    pub blur: bool,
    pub decorations: bool,
    // pub window_icon: Option<Icon>,
    // pub preferred_theme: Option<Theme>,
    // pub resize_increments: Option<Size>,
    pub content_protected: bool,
    // pub window_level: WindowLevel,
    pub active: bool,
}

impl From<WindowLevel> for winit::window::WindowLevel {
    fn from(value: WindowLevel) -> Self {
        match value {
            WindowLevel::AlwaysOnBottom => winit::window::WindowLevel::AlwaysOnBottom,
            WindowLevel::Normal => winit::window::WindowLevel::Normal,
            WindowLevel::AlwaysOnTop => winit::window::WindowLevel::AlwaysOnTop,
        }
    }
}

impl From<winit::window::WindowLevel> for WindowLevel {
    fn from(value: winit::window::WindowLevel) -> Self {
        match value {
            winit::window::WindowLevel::AlwaysOnBottom => WindowLevel::AlwaysOnBottom,
            winit::window::WindowLevel::Normal => WindowLevel::Normal,
            winit::window::WindowLevel::AlwaysOnTop => WindowLevel::AlwaysOnTop,
        }
    }
}

impl From<Theme> for winit::window::Theme {
    fn from(value: Theme) -> Self {
        match value {
            Theme::Light => winit::window::Theme::Light,
            Theme::Dark => winit::window::Theme::Dark,
        }
    }
}

impl From<winit::window::Theme> for Theme {
    fn from(value: winit::window::Theme) -> Self {
        match value {
            winit::window::Theme::Light => Theme::Light,
            winit::window::Theme::Dark => Theme::Dark,
        }
    }
}

// impl From<WindowAttributes> for winit::window::WindowAttributes {
//     fn from(value: WindowAttributes) -> Self {
//         let mut attrs = Self::default();
//         attrs.inner_size = value.inner_size.map(Into::into);
//         attrs.min_inner_size = value.min_inner_size.map(Into::into);
//         attrs.max_inner_size = value.max_inner_size.map(Into::into);
//         attrs.position = value.position.map(Into::into);
//         attrs.resizable = value.resizable;
//         attrs.enabled_buttons = value.enabled_buttons;
//         attrs.title = value.title;
//         attrs.maximized = value.maximized;
//         attrs.visible = value.visible;
//         attrs.transparent = value.transparent;
//         attrs.blur = value.blur;
//         attrs.decorations = value.decorations;
//         attrs.preferred_theme = value.preferred_theme.map(Into::into);
//         attrs.resize_increments = value.resize_increments.map(Into::into);
//         attrs.content_protected = value.content_protected;
//         attrs.window_level = value.window_level.into();
//         attrs.active = value.active;
//         attrs
//     }
// }

// impl Default for WindowAttributes {
//     fn default() -> Self {
//         let attrs = winit::window::WindowAttributes::default();
//         Self {
//             // inner_size: attrs.inner_size.map(Into::into),
//             // min_inner_size: attrs.min_inner_size.map(Into::into),
//             // max_inner_size: attrs.max_inner_size.map(Into::into),
//             // position: attrs.position.map(Into::into),
//             resizable: attrs.resizable,
//             // enabled_buttons: attrs.enabled_buttons,
//             title: attrs.title.into_bytes(),
//             maximized: attrs.maximized,
//             visible: attrs.visible,
//             transparent: attrs.transparent,
//             blur: attrs.blur,
//             decorations: attrs.decorations,
//             // preferred_theme: attrs.preferred_theme.map(Into::into),
//             // resize_increments: attrs.resize_increments.map(Into::into),
//             content_protected: attrs.content_protected,
//             // window_level: attrs.window_level.into(),
//             active: attrs.active,
//         }
//     }
// }

impl From<WindowAttributes> for WindowBuilder {
    fn from(value: WindowAttributes) -> Self {
        let mut win = Self::new();

        // println!("gogogo, {:?}", unsafe { std::ffi::CStr::from_ptr(value.title) });

        // let title = unsafe { std::ffi::CStr::from_ptr(value.title) }
        //     .to_str()
        //     .unwrap()
        //     .to_string();

        // println!("{:?}", title);

        // if let Some(inner_size) = value.inner_size {
        //     win = win.with_inner_size(inner_size);
        // }
        // if let Some(min_inner_size) = value.min_inner_size {
        //     win = win.with_min_inner_size(min_inner_size);
        // }
        // if let Some(max_inner_size) = value.max_inner_size {
        //     win = win.with_max_inner_size(max_inner_size);
        // }
        // if let Some(position) = value.position {
        //     win = win.with_position(position);
        // }
        // if let Some(resize_increments) = value.resize_increments {
        //     win = win.with_resize_increments(resize_increments);
        // }
        win = win.with_resizable(value.resizable);
        // win = win.with_enabled_buttons(value.enabled_buttons);
        // win = win.with_title(title);
        win = win.with_maximized(value.maximized);
        win = win.with_visible(value.visible);
        win = win.with_transparent(value.transparent);
        win = win.with_blur(value.blur);
        win = win.with_decorations(value.decorations);
        // win = win.with_theme(value.preferred_theme.map(Into::into));
        win = win.with_content_protected(value.content_protected);
        // win = win.with_window_level(value.window_level.into());
        win = win.with_active(value.active);
        win
    }
}
