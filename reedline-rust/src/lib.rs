use std::ffi::CString;

use reedline::{DefaultPrompt, Reedline, Signal};

#[no_mangle]
pub fn new() -> *mut Reedline {
    Box::into_raw(Box::new(Reedline::create()))
}
#[no_mangle]
pub fn read_line(editor: *mut Reedline) -> *mut i8 {
    let sig = unsafe { &mut *editor }
        .read_line(&DefaultPrompt::default())
        .unwrap();
    if let Signal::Success(res) = sig {
        CString::new(res.as_str()).unwrap().into_raw()
    } else {
        std::ptr::null_mut()
    }
}
