export type LLMMessage = LLMTextMessage | LLMImageMessage;

export type LLMTextMessage = {
  type: "text";
  role: Role;
  text: string;
};

export type LLMImageMessage = {
  type: "image";
  role: Role;
  image: string;
};

export type Role = "user" | "system";

export type LLMAnthropicModel =
  | "claude-1.2-instant"
  | "claude-3-opus"
  | "claude-3-sonnet"
  | "claude-3-haiku"
  | "claude-3.5";
export type LLMModel = LLMAnthropicModel;
