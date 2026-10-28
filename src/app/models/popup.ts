export interface PopupAction {
  label: string;
  link: string;
}

// Title lines break on mobile and run as one line on desktop.
export interface PopupMessage {
  title: string[];
  text: string;
  action?: PopupAction;
}
