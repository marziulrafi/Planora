import EventsList from "@/src/components/event/events-list";

export default function UpcomingEventsPage() {
  return (
    <EventsList
      title="Upcoming Events"
      timeframe="upcoming"
      emptyMessage="No upcoming events found."
    />
  );
}
