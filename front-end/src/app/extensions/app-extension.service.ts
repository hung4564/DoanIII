import { Injectable } from '@angular/core';
import {
  ExtensionService,
  ExtensionRef,
  ExtensionConfig,
  DocumentListPresetRef,
  ExtensionLoaderService
} from '@alfresco/adf-extensions';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppExtensionService {
  documentListPresets: {
    files: Array<DocumentListPresetRef>;
    libraries: Array<DocumentListPresetRef>;
    favoriteLibraries: Array<DocumentListPresetRef>;
    shared: Array<DocumentListPresetRef>;
    recent: Array<DocumentListPresetRef>;
    favorites: Array<DocumentListPresetRef>;
    trashcan: Array<DocumentListPresetRef>;
    searchLibraries: Array<DocumentListPresetRef>;
  } = {
    files: [],
    libraries: [],
    favoriteLibraries: [],
    shared: [],
    recent: [],
    favorites: [],
    trashcan: [],
    searchLibraries: []
  };

  private _references = new BehaviorSubject<ExtensionRef[]>([]);
  references$: Observable<ExtensionRef[]>;
  constructor(protected loader: ExtensionLoaderService, protected extensions: ExtensionService) {
    this.references$ = this._references.asObservable();
  }
  async load() {
    const config = await this.extensions.load();
    this.setup(config);
  }
  setup(config: ExtensionConfig) {
    if (!config) {
      return;
    }

    const references = (config.$references || [])
      .filter(entry => typeof entry === 'object')
      .map(entry => <ExtensionRef>entry);
    this.documentListPresets = {
      files: this.getDocumentListPreset(config, 'files'),
      libraries: this.getDocumentListPreset(config, 'libraries'),
      favoriteLibraries: this.getDocumentListPreset(config, 'favoriteLibraries'),
      shared: this.getDocumentListPreset(config, 'shared'),
      recent: this.getDocumentListPreset(config, 'recent'),
      favorites: this.getDocumentListPreset(config, 'favorites'),
      trashcan: this.getDocumentListPreset(config, 'trashcan'),
      searchLibraries: this.getDocumentListPreset(config, 'search-libraries')
    };
    this._references.next(references);
  }
  /**
   * Provides a collection of document list columns for the particular preset.
   * The result is filtered by the **disabled** state.
   * @param key Preset key.
   */
  protected getDocumentListPreset(config: ExtensionConfig, key: string) {
    return this.loader
      .getElements<DocumentListPresetRef>(config, `features.documentList.${key}`)
      .filter(entry => !entry.disabled);
  }
}
