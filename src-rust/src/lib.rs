use reedline::{DefaultPrompt, Prompt as ReedLinePrompt, Reedline};
use std::{
    ffi::CString,
    mem::ManuallyDrop,
    sync::{Arc, Mutex},
};
mod prompt;
use prompt::Prompt;
mod signal;
use signal::Signal;
mod utils;
use utils::cstr_to_type;

#[no_mangle]
pub extern "C" fn create() -> *const Mutex<Reedline> {
    Arc::into_raw(Arc::new(Mutex::new(Reedline::create())))
}

#[no_mangle]
/// # Safety
/// Internal function
pub unsafe extern "C" fn read_line(editor: *const Mutex<Reedline>, prompt: *mut i8) -> *mut i8 {
    let editor = ManuallyDrop::new(Arc::from_raw(editor));

    let prompt: Box<dyn ReedLinePrompt> = if prompt.is_null() {
        Box::new(DefaultPrompt::default())
    } else {
        let prompt: Prompt = cstr_to_type(prompt).unwrap();
        Box::new(prompt)
    };

    let sig = editor.lock().unwrap().read_line(&*prompt).unwrap();
    let sig: Signal = sig.into();

    CString::new(nanoserde::SerJson::serialize_json(&sig))
        .unwrap()
        .into_raw()
}
