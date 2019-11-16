import { RuleContext } from '@alfresco/adf-extensions';

/**
 * Checks if the quick share repository option is enabled or not.
 * JSON ref: `repository.isQuickShareEnabled`
 */
export function hasQuickShareEnabled(context: RuleContext): boolean {
  return context.repository.status.isQuickShareEnabled;
}
