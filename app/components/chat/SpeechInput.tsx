import { useAppStore } from "@/app/store";
import { Mic } from "lucide-react";
import { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

let timer: any;

export const SpeechInput = () => {
  const setTextInput = useAppStore((state) => state.setTextInput);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    setTextInput(transcript);
  }, [transcript, setTextInput]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  };

  useEffect(() => {
    if (transcript) {
      clearTimeout(timer!);
      timer = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 5000);
    }
  }, [transcript]);

  return (
    <button className={"btn btn-outline "} onClick={toggleListening}>
      {listening ? <div className="loading loading-ball loading-xs" /> : <Mic size={16} />}
    </button>
  );
};
