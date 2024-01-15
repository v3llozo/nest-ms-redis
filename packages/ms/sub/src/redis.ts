export interface message {
  channel: string;
  value: Status;
}

export interface Status {
  status: string;
  updatedAt: Date;
}

// "{\"status\":\"executado\", \"updatedAt\":\"2023-12-21_15-52-00\"}"
