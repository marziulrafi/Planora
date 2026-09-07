import EventsList from "@/src/components/event/events-list";

export default function PastEventsPage() {
  return (
    <EventsList
      title="Past Events"
      timeframe="past"
      emptyMessage="No past events found."
    />
  );
}
