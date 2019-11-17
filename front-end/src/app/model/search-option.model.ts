export enum SearchOptionIds {
  Files = 'content',
  Folders = 'folder',
  Libraries = 'libraries'
}

export interface SearchOptionModel {
  id: SearchOptionIds;
  key: string;
  value: boolean;
  shouldDisable(): boolean;
}
