export interface DeleteStatus {
  success: any[];
  fail: any[];
  someFailed: boolean;
  someSucceeded: boolean;
  oneFailed: boolean;
  oneSucceeded: boolean;
  allSucceeded: boolean;
  allFailed: boolean;
  reset(): void;
}
