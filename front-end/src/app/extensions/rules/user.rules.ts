import { CustomRuleContext } from "app/model/custom-rule-context.model";

/**
 * Checks if user is admin.
 * JSON ref: `user.isAdmin`
 */
export function isAdmin(context: CustomRuleContext): boolean {
  return context.profile.isAdmin;
}
