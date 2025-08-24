export type TextAreaRefProps = {
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>; // Ref for the textarea
};

export type DashboardCommonProps = TextAreaRefProps & {
  autoCopy: boolean; // Indicates if auto-copy is enabled
  copyToClipBoard: (value: string) => void; // Function to copy text to clipboard
};