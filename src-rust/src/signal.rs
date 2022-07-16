use nanoserde::SerJson;
use reedline::Signal as ReedLineSignal;

#[derive(SerJson)]
pub enum Signal {
    Success(String),
    CtrlC,
    CtrlD,
}
impl From<ReedLineSignal> for Signal {
    fn from(s: ReedLineSignal) -> Self {
        match s {
            ReedLineSignal::Success(r) => Self::Success(r),
            ReedLineSignal::CtrlC => Self::CtrlC,
            ReedLineSignal::CtrlD => Self::CtrlD,
        }
    }
}
