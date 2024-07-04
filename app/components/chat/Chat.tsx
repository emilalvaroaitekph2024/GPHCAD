"use client";

import { llmConnector } from "@/app/helpers/llmConnector";
import { useAppStore } from "@/app/store";
import { LLMMessage, LLMTextMessage } from "@/app/types/llm";
import { KeyboardEvent, useRef } from "react";
import { ChatMessage } from "./ChatMessage";

export const Chat = () => {
  const messages = useAppStore((state) => state.messages);
  const error = useAppStore((state) => state.error);
  const sendingMessage = useAppStore((state) => state.sendingMessage);
  const textInput = useAppStore((state) => state.textInput);
  const imageInput = useAppStore((state) => state.imageInput);
  const model = useAppStore((state) => state.model);
  const setTextInput = useAppStore((state) => state.setTextInput);
  const setImageInput = useAppStore((state) => state.setImageInput);
  const setError = useAppStore((state) => state.setError);
  const setSendingMessage = useAppStore((state) => state.setSendingMessage);
  const setMessages = useAppStore((state) => state.setMessages);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async ({
    textInput,
    sendFromIndex = Infinity,
  }: { textInput?: string; sendFromIndex?: number } = {}) => {
    setError(null);
    setTextInput("");
    setImageInput("");
    setSendingMessage(true);

    try {
      const filteredMessages = [...messages].filter((_, index) => index <= sendFromIndex);

      if (textInput) {
        const userMessage: LLMMessage = {
          role: "user",
          type: "text",
          text: textInput,
          model,
          date: new Date().toISOString(),
        };
        filteredMessages.push(userMessage);
      }

      setMessages(filteredMessages);

      const text = await llmConnector[model](filteredMessages);

      const assistantMessage: LLMMessage = {
        role: "assistant",
        type: "text",
        text,
        model,
        date: new Date().toISOString(),
      };

      filteredMessages.push(assistantMessage);

      console.log(text);

      setMessages(filteredMessages);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      console.error(error);
      if (textInput) setImageInput(textInput);
    }

    setTextInput("");
    setImageInput("");
    setSendingMessage(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage({ textInput });
    }
  };

  const handleInputChange = () => {
    const el = textareaRef.current;

    if (el) {
      if (el.value.includes("\n")) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      } else {
        el.style.height = "auto";
        el.style.height = "48px";
      }
    }
  };

  const updateMessage = (message: LLMMessage, index: number) => {
    const newMessages = [...messages];
    newMessages[index] = message;
    setMessages(newMessages);
  };

  const deleteMessage = (index: number) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const onRerun = async (index: number) => {
    sendMessage({ sendFromIndex: index });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex flex-col">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message as LLMTextMessage}
            onChange={(message) => updateMessage(message, index)}
            onDelete={() => deleteMessage(index)}
            onRerun={() => onRerun(index)}
          />
        ))}
      </div>
      <div className="w-full flex flex-row items-end gap-4 m-4">
        <textarea
          className="flex-1 h-[48px] textarea textarea-primary"
          placeholder="Enter a message..."
          value={textInput}
          ref={textareaRef}
          onChange={(event) => setTextInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInputChange}
        />
        <button className="btn btn-primary" onClick={() => sendMessage({ textInput })} disabled={sendingMessage}>
          Send
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
