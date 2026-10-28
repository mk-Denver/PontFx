import type { TrackedLeg } from "./client";
import type { PIP02ActionPayload } from "./webhooks";

export function pollToActions(
  _coordinationId: string,
  _leg: TrackedLeg
): PIP02ActionPayload {
  throw new Error("not implemented: pollToActions (issue #8)");
}
