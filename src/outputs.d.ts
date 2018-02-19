export interface OutputPrintFunc {
  (message: string): void
}

export interface OutputClearFunc {
  (): void
}

export interface Output {
  print: OutputPrintFunc;
  clear: OutputClearFunc;
}

export interface OutputsDict {
  [key: string]: Output;
}
