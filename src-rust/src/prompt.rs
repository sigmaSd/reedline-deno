use nanoserde::DeJson;
use reedline::Prompt as ReedLinePrompt;
use std::borrow::Cow;

#[derive(DeJson)]
pub struct Prompt {
    render_prompt_left: String,
    render_prompt_right: String,
}

impl ReedLinePrompt for Prompt {
    fn render_prompt_right(&self) -> Cow<str> {
        Cow::Borrowed(&self.render_prompt_right)
    }

    fn render_prompt_left(&self) -> Cow<str> {
        Cow::Borrowed(&self.render_prompt_left)
    }

    fn render_prompt_indicator(&self, _prompt_mode: reedline::PromptEditMode) -> Cow<str> {
        Cow::Borrowed("")
    }

    fn render_prompt_multiline_indicator(&self) -> Cow<str> {
        Cow::Borrowed("")
    }

    fn render_prompt_history_search_indicator(
        &self,
        _history_search: reedline::PromptHistorySearch,
    ) -> Cow<str> {
        Cow::Borrowed("")
    }
}
