use reedline::{DefaultPrompt, Prompt, Reedline, Signal};
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
pub extern "C" fn read_line(editor: *const Mutex<Reedline>, prompt: *mut i8) -> *mut i8 {
    let editor = ManuallyDrop::new(unsafe { Arc::from_raw(editor) });
    let prompt: Box<dyn Prompt> = if prompt.is_null() {
        Box::new(DefaultPrompt::default())
    } else {
        let prompt = ManuallyDrop::new(unsafe { CString::from_raw(prompt) });
        let prompt = prompt.to_str().unwrap().to_string();
        Box::new(SimplePrompt { prompt })
    };

    let sig = editor.lock().unwrap().read_line(&*prompt).unwrap();

    if let Signal::Success(res) = sig {
        CString::new(res.as_str()).unwrap().into_raw()
    } else {
        std::ptr::null_mut()
    }
}
struct SimplePrompt {
    prompt: String,
}

impl Prompt for SimplePrompt {
    fn render_prompt_left(&self) -> std::borrow::Cow<str> {
        std::borrow::Cow::Borrowed(&self.prompt)
    }

    fn render_prompt_right(&self) -> std::borrow::Cow<str> {
        std::borrow::Cow::Borrowed("")
    }

    fn render_prompt_indicator(
        &self,
        _prompt_mode: reedline::PromptEditMode,
    ) -> std::borrow::Cow<str> {
        std::borrow::Cow::Borrowed("")
    }

    fn render_prompt_multiline_indicator(&self) -> std::borrow::Cow<str> {
        std::borrow::Cow::Borrowed("")
    }

    fn render_prompt_history_search_indicator(
        &self,
        _history_search: reedline::PromptHistorySearch,
    ) -> std::borrow::Cow<str> {
        std::borrow::Cow::Borrowed("")
    }
}
