export type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

// 1. 定义类型（如果是纯 JS 可忽略类型定义）
export type OriginalItem = {
  lastTime: number;
  isSm: number;
  cycle: number;
  newEf: number;
  nextTime: number;
  repetitions: number;
  interval: number;
  forgetCount: number;
  successCount: number;
  grade: number | null;
  forget: any; // 或 null
  ef: number;
  targetRetention: number;
  id: number;
  alias: string; // 例如 "中国人[ちゅうごくじん]"
  filePath: string;
  status: number;
  paraphrase: string; // 例如 "中国人"
  prototype: string | null;
  sort: number;
  bookPath: string;
  coursePath: string;
  wordType: string;
  table: any; // 或 null
  etymology: any; // 或 null
  supplementAudio: any; // 或 null
  prototypeAudio: any; // 或 null
  bid: number;
  cid: number;
  uid: number;
};

export type IssueType = "CN" | "JP" | "RM";

export type TransformedItem = OriginalItem & {
  issueType: IssueType;
  issue: string; // 题干
  key: string; // 正确答案
  options: string[]; // 备选干扰项
};

export interface GetParamDTO {
  /** 用户 ID */
  uid: number;
  /** 记录或项的 ID */
  id?: number;
  /** 随机数量 */
  num?: number;
  /** 当前页码 */
  page?: number;
  /** 每页大小 */
  pageSize?: number;
  enumNum?: number;
}
