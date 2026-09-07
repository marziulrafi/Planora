const EVENT_TIMEZONE = "Asia/Dhaka";

export function getTodayDateStr(timeZone = EVENT_TIMEZONE): string {
  return new Date().toLocaleDateString("en-CA", { timeZone });
}

export function getEventDateStr(isoDate: string, timeZone = EVENT_TIMEZONE): string {
  return new Date(isoDate).toLocaleDateString("en-CA", { timeZone });
}

export function isPastEvent(isoDate: string, timeZone = EVENT_TIMEZONE): boolean {
  return getEventDateStr(isoDate, timeZone) < getTodayDateStr(timeZone);
}

export function isUpcomingEvent(isoDate: string, timeZone = EVENT_TIMEZONE): boolean {
  return getEventDateStr(isoDate, timeZone) >= getTodayDateStr(timeZone);
}

export function filterEventsByTimeframe<T extends { date: string }>(
  events: T[],
  timeframe: "upcoming" | "past",
  timeZone = EVENT_TIMEZONE
): T[] {
  return events.filter((event) =>
    timeframe === "past" ? isPastEvent(event.date, timeZone) : isUpcomingEvent(event.date, timeZone)
  );
}

export function sortEventsByTimeframe<T extends { date: string }>(
  events: T[],
  timeframe: "upcoming" | "past"
): T[] {
  return [...events].sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return timeframe === "past" ? -diff : diff;
  });
}
