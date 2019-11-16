import { Node } from '@alfresco/js-api';

export function isLocked(node: { entry: Node }): boolean {
  const { entry } = node;

  return (
    (entry && entry.isLocked) ||
    (entry.properties &&
      (entry.properties['cm:lockType'] === 'READ_ONLY_LOCK' ||
        entry.properties['cm:lockType'] === 'WRITE_LOCK'))
  );
}

export function isLibrary(node: { entry: Node | any }): boolean {
  const { entry } = node;

  return (
    (entry.guid &&
      entry.id &&
      entry.preset &&
      entry.title &&
      entry.visibility) ||
    entry.nodeType === 'st:site'
  );
}
