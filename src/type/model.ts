export interface ChatRequest {
  model: string;
  messages: Message[];
  stream: boolean;
}

export interface Message {
  // id: string // 确保每条会话都是唯一
  role: "user" | "assistant" | "system";
  content: string;
  satisfaction?: number | null; // 满意度
}

export interface ChatCompletionChunk {
  object: string;
  choices: Choice[];
}

export interface Choice {
  index: number;
  delta: Delta;
  finish_reason: string | null;
}

export interface Delta {
  role: string;
  content: string;
  function_call: any; // 如果 function_call 可以是其他类型，可以更改为适当的类型
}
