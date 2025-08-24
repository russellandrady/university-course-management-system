"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { DashboardManager } from "@/api/services/DashboardService";
import type { TranslationResponse } from "@/types/TranslationRespose";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { DashboardCommonProps } from "@/types/DashboardCommon";

interface Position {
  top: number;
  left: number;
}

interface TextareaProps
  extends React.ComponentProps<"textarea">,
    DashboardCommonProps {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, onChange, autoCopy, textAreaRef, copyToClipBoard, ...props },
    ref
  ) => {
    const [lastWord, setLastWord] = React.useState<string>("");
    // Add near other state declarations
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const [position, setPosition] = React.useState<Position>({
      top: 0,
      left: 0,
    });

    const { data: suggestions } = useQuery({
      queryKey: ["translation", lastWord],
      queryFn: () => DashboardManager.getTranslation(lastWord),
      enabled: lastWord.length > 0,
      select: (data: TranslationResponse) => data[1][0][1],
    });

    const calculateScrollAreaPosition = () => {
      const textarea = textAreaRef?.current;
      if (!textarea) return;

      // Get current line text
      const text = textarea.value;
      const lines = text.split("\n");

      const currentLineNumber =
        text.substring(0, textarea.selectionStart).split("\n").length - 1;
      const currentLine = lines[currentLineNumber].trim(); // Trim the line to handle spaces
      // Get text before last word in current line
      const words = currentLine.split(" ");
      const lastWord = words[words.length - 1].trim(); // Trim last word
      const textBeforeLastWord = currentLine.slice(0, -lastWord.length);

      // Create measuring div for the line
      const div = document.createElement("div");
      div.style.font = window.getComputedStyle(textarea).font;
      div.style.position = "absolute";
      div.style.visibility = "hidden";
      div.textContent = textBeforeLastWord;

      document.body.appendChild(div);

      // Get positions
      const rect = textarea.getBoundingClientRect();
      const lineHeight = Number.parseInt(
        window.getComputedStyle(textarea).lineHeight
      );
      const textWidth = div.getBoundingClientRect().width;

      document.body.removeChild(div);

      // Calculate final position
      const top = rect.top + currentLineNumber * lineHeight + lineHeight; // Added lineHeight to move it below
      const left =
        rect.left +
        textWidth +
        Number.parseInt(window.getComputedStyle(textarea).paddingLeft);

      setPosition({ top, left });
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      const text = textarea.value;
      const cursorPosition = textarea.selectionStart;

      autoCopy && copyToClipBoard(text);

      // Process text to add line breaks based on textarea width
      const processedText = addLineBreaks(text, textarea, cursorPosition);

      // If text was modified with line breaks, update the textarea
      if (processedText.text !== text) {
        // Update the value
        textarea.value = processedText.text;

        // Restore cursor position, accounting for any added line breaks
        textarea.selectionStart = processedText.newCursorPosition;
        textarea.selectionEnd = processedText.newCursorPosition;

        // Create a new event to pass the modified value
        const newEvent = {
          ...e,
          target: {
            ...textarea,
            value: processedText.text,
          },
        } as React.ChangeEvent<HTMLTextAreaElement>;

        // Process the words for the existing logic
        const words = processedText.text.split(" ");
        const currentLastWord = words[words.length - 1];
        const isEnglishOnly = /^[a-zA-Z]*$/.test(currentLastWord);

        if (currentLastWord !== lastWord && isEnglishOnly) {
          setLastWord(currentLastWord);
          calculateScrollAreaPosition();
        }

        // Call the original onChange with our modified event
        if (onChange) {
          onChange(newEvent);
        }

        return;
      }

      // If no line breaks were added, continue with original logic
      const words = text.split(" ");
      const currentLastWord = words[words.length - 1];
      const isEnglishOnly = /^[a-zA-Z]*$/.test(currentLastWord);

      if (currentLastWord !== lastWord && isEnglishOnly) {
        setLastWord(currentLastWord);
        calculateScrollAreaPosition();
      }

      // Call the original onChange if provided
      if (onChange) {
        onChange(e);
      }
    };

    // Function to add line breaks based on textarea width
    const addLineBreaks = (
      text: string,
      textarea: HTMLTextAreaElement,
      cursorPosition: number
    ): { text: string; newCursorPosition: number } => {
      // Get textarea width
      const textareaWidth = textarea.clientWidth;

      // Use a more accurate method to measure text width
      const getTextWidth = (text: string): number => {
        // Create hidden span with the same styling as the textarea
        const span = document.createElement("span");
        span.style.font = window.getComputedStyle(textarea).font;
        span.style.visibility = "hidden";
        span.style.position = "absolute";
        span.style.whiteSpace = "nowrap";
        span.textContent = text;
        document.body.appendChild(span);

        // Measure the width
        const width = span.getBoundingClientRect().width;

        // Clean up
        document.body.removeChild(span);
        return width;
      };

      // Account for padding and border
      const style = window.getComputedStyle(textarea);
      const paddingLeft = Number.parseFloat(style.paddingLeft);
      const paddingRight = Number.parseFloat(style.paddingRight);
      const borderLeft = Number.parseFloat(style.borderLeftWidth);
      const borderRight = Number.parseFloat(style.borderRightWidth);

      // Available width for text
      const availableWidth =
        textareaWidth -
        paddingLeft -
        paddingRight -
        borderLeft -
        borderRight -
        20; // Increased buffer

      // Split text into lines
      const lines = text.split("\n");
      const newLines: string[] = [];
      let newCursorPosition = cursorPosition;
      let processedChars = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // If line is already shorter than max width, keep it as is
        if (getTextWidth(line) <= availableWidth) {
          newLines.push(line);
          processedChars += line.length + (i < lines.length - 1 ? 1 : 0); // +1 for the \n
          continue;
        }

        // Process line that's too long
        let currentLine = "";
        const words = line.split(" ");

        for (let j = 0; j < words.length; j++) {
          const word = words[j];
          // Check if adding this word would exceed the line width
          const potentialLine = currentLine ? `${currentLine} ${word}` : word;

          if (getTextWidth(potentialLine) > availableWidth) {
            // Only add a line break if we're not at the cursor position
            // or if we're significantly over the width limit
            const isCursorInWord =
              processedChars + currentLine.length + (currentLine ? 1 : 0) <=
                cursorPosition &&
              cursorPosition <= processedChars + potentialLine.length;

            const isSignificantlyOverWidth =
              getTextWidth(potentialLine) > availableWidth * 1.1;

            if (!isCursorInWord || isSignificantlyOverWidth) {
              // Add current line to results and start a new line
              if (currentLine) {
                newLines.push(currentLine);

                // If cursor was after this point, adjust cursor position
                if (processedChars + currentLine.length < cursorPosition) {
                  newCursorPosition += 1; // Add 1 for the new line break
                }

                processedChars += currentLine.length + 1; // +1 for the \n
                currentLine = word;
              } else {
                // If the word itself is longer than a line, just add it
                newLines.push(word);

                // If cursor was after this point, adjust cursor position
                if (processedChars + word.length < cursorPosition) {
                  newCursorPosition += 1; // Add 1 for the new line break
                }

                processedChars += word.length + 1; // +1 for the \n
                currentLine = "";
              }
            } else {
              // If cursor is in this word, don't break the line yet
              currentLine = potentialLine;
            }
          } else {
            // Add word to current line
            currentLine = potentialLine;
          }
        }

        // Add the last line if there's anything left
        if (currentLine) {
          newLines.push(currentLine);
          processedChars += currentLine.length + (i < lines.length - 1 ? 1 : 0);
        }
      }

      return {
        text: newLines.join("\n"),
        newCursorPosition,
      };
    };

    const handleWordReplace = (
      suggestion: string,
      textarea: HTMLTextAreaElement | null,
    ) => {
      if (!textarea) return;

      const text = textarea.value;
      const words = text.split(" ");
      words[words.length - 1] = suggestion;
      textarea.value = words.join(" ") + " ";

      // Reset states
      autoCopy && copyToClipBoard(textarea.value);
      setLastWord("");
      setSelectedIndex(0);
    };

    // Add after handleChange function
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      console.log("Cme here");
      if (e.key === "Enter") {
        e.preventDefault();
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setLastWord(""); // Clear the last word
        setSelectedIndex(0); // Reset the selected index
        return;
      }

      if (!suggestions) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % suggestions.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + suggestions.length) % suggestions.length
          );
          break;
        case " ":
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            e.preventDefault();
            handleWordReplace(
              suggestions[selectedIndex],
              textAreaRef?.current,
            );
          }
          break;
      }
    };

    return (
      <>
        <textarea
          onKeyDown={handleKeyDown}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={(node) => {
            // Handle both refs
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            if (textAreaRef && textAreaRef.current !== undefined) {
              textAreaRef.current = node;
            }
          }}
          onChange={handleChange}
          {...props}
        />
        {suggestions && (
          <div
            className="absolute z-50 max-h-[150px]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <ScrollArea className="h-auto max-h-[150px] max-w-[150px]">
              <div className="max-h-[150px] p-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={suggestion}
                    variant={index === selectedIndex ? "default" : "ghost"}
                    className="w-full justify-start text-left h-8 px-2 py-1 my-1"
                    onClick={() => {
                      handleWordReplace(
                        suggestion,
                        textAreaRef?.current,
                      );
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
