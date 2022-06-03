use reedline::{DefaultPrompt, Reedline, Signal};
use std::{
    ffi::CString,
    mem::ManuallyDrop,
    sync::{Arc, Mutex},
};

#[no_mangle]
pub extern "C" fn new() -> *const Mutex<Reedline> {
    Arc::into_raw(Arc::new(Mutex::new(Reedline::create())))
}

#[no_mangle]
pub extern "C" fn read_line(editor: *const Mutex<Reedline>) -> *mut i8 {
    let editor = ManuallyDrop::new(unsafe { Arc::from_raw(editor) });

    let sig = editor
        .lock()
        .unwrap()
        .read_line(&DefaultPrompt::default())
        .unwrap();

    if let Signal::Success(res) = sig {
        CString::new(res.as_str()).unwrap().into_raw()
    } else {
        std::ptr::null_mut()
    }
}
