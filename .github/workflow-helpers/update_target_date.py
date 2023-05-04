import json
import re
import pytz
from datetime import datetime

def load_upcoming_event(file_path):
    with open(file_path, 'r') as f:
        events_raw = json.load(f)
        now = datetime.utcnow()
        now = now.astimezone(pytz.utc)

        events = []
        for event in events_raw.values():
            event_start = event['start'].get('dateTime') or event['start'].get('date')
            event_timezone = event['start'].get('timeZone')
            event_start = datetime.fromisoformat(event_start)
            if event_timezone:
                timezone = pytz.timezone(event_timezone)
                event_start = event_start.astimezone(timezone)

            # Set the event location to the event location if it exists, otherwise set it to 'Campus'
            event_location = event.get('location') or 'Campus'

            events.append({
                "event_start": event_start,
                "event_location": event_location
                })

        future_events = [event for event in events if event["event_start"] > now]
        upcoming_event = None

        if len(future_events) > 0:
            upcoming_event = min(future_events, key=lambda event: event['event_start'])
        elif len(events) > 0:
            upcoming_event = max(events, key=lambda event: event['event_start'])

        return upcoming_event

def update_target_date_and_location(file_path, target_date, event_location):
    with open(file_path, 'r') as f:
        content = f.read()

    # Update the target_date in index.markdown
    updated_content = re.sub(r"target_date: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2})", f"target_date: {target_date}", content)
    # Update event_location line in index.markdown
    updated_content = re.sub(r"event_location: (.*)", f"event_location: {event_location}", updated_content)
    with open(file_path, 'w') as f:
        f.write(updated_content)

# Load the upcoming event from calendar_events.json
upcoming_event = load_upcoming_event('.github/workflow-helpers/calendar_events.json')
upcoming_event["event_start"] = upcoming_event["event_start"].replace(microsecond=0).isoformat()


# Update the target_date in index.markdown
if upcoming_event:
    for filename in ['index.markdown', 'preview.markdown']:
        update_target_date_and_location(filename, upcoming_event["event_start"], upcoming_event["event_location"])
    # update_target_date_and_location('index.markdown', upcoming_event["event_start"], upcoming_event["event_location"])
