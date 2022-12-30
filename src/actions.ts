export type ActionType =
  | "sort-asc"
  | "sort-desc"
  | "remove-dup"
  | "remove-initial"
  | "only-current-tab"
  | "group-tabs"
  | "ungroup-tabs";

export const actions = new Map<ActionType, string>([
  ["sort-asc", "Sort tabs by URL in asc order"],
  ["sort-desc", "Sort tabs by URL in desc order"],
  ["remove-dup", "Remove duplicated tabs"],
  ["remove-initial", "Remove initial state tabs"],
  ["only-current-tab", "Remove all tabs except the current one"],
  ["group-tabs", "Group tabs by Domain"],
  ["ungroup-tabs", "Ungroup tabs"],
]);
