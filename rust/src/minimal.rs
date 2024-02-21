#[repr(C)]
pub enum Event {
    Moved(i32, i32),
}

#[no_mangle]
pub extern "C" fn poll_events(callback: extern "C" fn(&Event)) {
    let event = Event::Moved(10i32, 20i32);
    callback(&event);
    // drop(event);
    println!("Dropped");
}
