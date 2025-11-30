export function computeNextCharge(frequency, billingDate, lastCharge) {
  const base = new Date(lastCharge || billingDate);

  if (!base) return null;

  const next = new Date(base);

  switch (frequency) {
    case "WEEKLY":
      next.setDate(base.getDate() + 7);
      break;
    case "BIWEEKLY":
      next.setDate(base.getDate() + 14);
      break;
    case "MONTHLY":
      next.setMonth(base.getMonth() + 1);
      break;
    case "QUARTERLY":
      next.setMonth(base.getMonth() + 3);
      break;
    case "YEARLY":
      next.setFullYear(base.getFullYear() + 1);
      break;
    case "ONCE":
    default:
      return null;
  }

  return next;
}
 