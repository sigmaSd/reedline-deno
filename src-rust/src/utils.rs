use nanoserde::{DeJson, DeJsonErr};
use std::{ffi::CString, mem::ManuallyDrop};

pub fn cstr_to_type<T: DeJson>(cstr: *mut i8) -> Result<T, DeJsonErr> {
    let cstr = ManuallyDrop::new(unsafe { CString::from_raw(cstr) });
    T::deserialize_json(cstr.to_str().unwrap())
}
