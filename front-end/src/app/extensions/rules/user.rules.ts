import { RuleContext } from '@alfresco/adf-extensions';

/**
 * Checks if user is admin.
 * JSON ref: `user.isAdmin`
 */
export function isAdmin(context: RuleContext): boolean {
  return context.profile.isAdmin;
}
