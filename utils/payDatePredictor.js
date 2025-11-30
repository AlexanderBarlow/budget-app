export function predictNextPayDates({
  mostRecentPay,
  previousPayDate,
  payFrequency,
  count = 12,
}) {
  if (!mostRecentPay) return [];

  const recent = new Date(mostRecentPay);
  let intervalDays = null;

  // Auto detect interval
  if (previousPayDate) {
    const prev = new Date(previousPayDate);
    const diff = Math.round((recent - prev) / (1000 * 60 * 60 * 24));

    if (diff >= 6 && diff <= 8) intervalDays = 7;
    else if (diff >= 13 && diff <= 15) intervalDays = 14;
    else if (diff >= 27 && diff <= 32) intervalDays = 30;
  }

  if (!intervalDays) {
    switch (payFrequency) {
      case "WEEKLY":
        intervalDays = 7;
        break;
      case "BIWEEKLY":
        intervalDays = 14;
        break;
      case "MONTHLY":
        intervalDays = 30;
        break;
      case "SEMIMONTHLY":
        return generateSemiMonthly({ mostRecentPay: recent, count });
      default:
        intervalDays = 14;
    }
  }

  const dates = [];
  let cursor = recent;

  for (let i = 0; i < count; i++) {
    cursor = new Date(cursor.getTime() + intervalDays * 86400000);
    dates.push(cursor.toISOString().split("T")[0]);
  }

  return dates;
}

function generateSemiMonthly({ mostRecentPay, count }) {
  const results = [];
  let date = new Date(mostRecentPay);

  for (let i = 0; i < count; i++) {
    const day = date.getDate();

    if (day <= 15) {
      date = new Date(date.getFullYear(), date.getMonth(), 15);
    } else {
      date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    results.push(date.toISOString().split("T")[0]);

    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  }

  return results;
}
