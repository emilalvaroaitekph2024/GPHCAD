import { LLMImageMessage, modelNames } from "@/app/types/llm";
import { Eye, Pencil, RefreshCw, Save, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { SketchInput } from "./SketchInput";
import { getImageFromCanvas } from "@/app/helpers/extractImage";

type Props = {
  message: LLMImageMessage;
  onChange: (message: LLMImageMessage) => void;
  onDelete: () => void;
  onRerun: () => void;
};

export const SketchMessage = ({ message, onChange, onRerun, onDelete }: Props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const drawingCanvasRef = useRef<ReactSketchCanvasRef>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(message.image);

  const isUser = message.role === "user";

  const handleOpenEditButtonClick = () => {
    setEdit(true);
  };

  const handleSaveEditButtonClick = async () => {
    setEdit(false);
    const image = await getImageFromCanvas(drawingCanvasRef.current);
    onChange({ ...message, image });
  };

  const handleClearEditButtonClick = () => {
    drawingCanvasRef.current?.clearCanvas();
    setBackgroundImage(undefined);
  };

  const handleShow = () => {
    onChange({ ...message, hidden: false });
  };

  const resizeTextarea = () => {
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

  useEffect(() => {
    setTimeout(() => {
      resizeTextarea();
    }, 100);
  }, [edit]);

  const tools = (
    <div
      className={`absolute group-hover:visible invisible top-0 bottom-0 flex flex-row items-center mx-3 gap-2 opacity-30 ${
        isUser ? "right-full flex-row-reverse" : "left-full"
      }`}
    >
      {message.editable !== false && !edit && (
        <div onClick={handleOpenEditButtonClick} className="hover:opacity-80 cursor-pointer">
          <Pencil size={16} />
        </div>
      )}
      {edit && (
        <div onClick={handleSaveEditButtonClick} className="hover:opacity-80 cursor-pointer">
          <Save size={16} />
        </div>
      )}
      {isUser && (
        <div onClick={onRerun} className="hover:opacity-80 cursor-pointer">
          <RefreshCw size={16} />
        </div>
      )}
      <div onClick={onDelete} className="hover:text-red-300 cursor-pointer">
        <Trash size={16} />
      </div>
    </div>
  );

  const hidden = (
    <div
      className={`absolute group-hover:visible invisible top-0 bottom-0 flex flex-row items-center mx-3 gap-2 opacity-30 ${
        isUser ? "right-full flex-row-reverse" : "left-full"
      }`}
    >
      <div onClick={handleShow} className="hover:opacity-80 cursor-pointer" title="Show message">
        <Eye size={16} />
      </div>
      <div onClick={onDelete} className="hover:text-red-300 cursor-pointer" title="Remove message">
        <Trash size={16} />
      </div>
    </div>
  );

  return (
    <div className={`chat group ${isUser ? "chat-end pl-12" : "chat-start pr-12"}`}>
      <div className="chat-header">{isUser ? "You" : modelNames[message.model]}</div>
      <div className="chat-bubble relative bg-transparent px-0">
        {!message.hidden && !edit && <img src={message.image} className="rounded-lg" />}
        {!message.hidden && edit && (
          <SketchInput
            ref={drawingCanvasRef}
            height={256}
            width={256}
            onClear={handleClearEditButtonClick}
            toggleEraser={drawingCanvasRef.current?.eraseMode}
            canvasProps={{
              backgroundImage,
            }}
          />
        )}
        {message.hidden && (
          <div className="text-gray-400">
            <i>{message.hiddenText || "This image is hidden"}</i>
          </div>
        )}
        {message.hidden ? hidden : tools}
      </div>
      <div className="chat-footer opacity-50">Sent {new Date(message.date).toLocaleString()}</div>
    </div>
  );
};
