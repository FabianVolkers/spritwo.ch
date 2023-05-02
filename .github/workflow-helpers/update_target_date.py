import json
import re
from datetime import datetime

def load_upcoming_event_date(file_path):
    with open(file_path, 'r') as f:
        events = json.load(f)
        now = datetime.utcnow()
        event_dates = [datetime.fromisoformat(event['start'].get('dateTime') or event['start'].get('date')) for event in events.values()]
        future_event_dates = [event_date for event_date in event_dates if event_date > now]
        upcoming_event_date = None
        if len(future_event_dates) > 0:
            upcoming_event_date = min(future_event_dates)
        return upcoming_event_date

def update_target_date(file_path, target_date):
    with open(file_path, 'r') as f:
        content = f.read()

    updated_content = re.sub(r"target_date: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2})", f"target_date: {target_date}", content)

    with open(file_path, 'w') as f:
        f.write(updated_content)

# Load the upcoming event date from calendar_events.json
upcoming_event_date = load_upcoming_event_date('.github/workflow-helpers/calendar_events.json')
upcoming_event_date = upcoming_event_date.replace(microsecond=0).isoformat()

# Update the target_date in index.markdown
if upcoming_event_date:
    update_target_date('index.markdown', upcoming_event_date)
