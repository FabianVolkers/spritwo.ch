import os
import json
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build


def load_existing_events(file_path):
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_updated_events(file_path, existing_events, new_events):
    for new_event in new_events:
        event_id = new_event['id']
        for key in [
            'attendees', 'creator', 'organizer', 'iCalUID', 
            'sequence', 'reminders', 'etag', 'status', 'kind', 
            'eventType', 'guestsCanInviteOthers', 
            'guestsCanSeeOtherGuests', 'recurringEventId', 
            'originalStartTime']:
            # Remove email addresses from event
            new_event.pop(key, None)
        existing_events[event_id] = new_event

    with open(file_path, 'w') as f:
        json.dump(existing_events, f, indent=2)


# Set up Google Calendar API
calendar_id = os.environ["GOOGLE_CALENDAR_ID"]
service_account_key_file = "service_account_key.json"

creds = service_account.Credentials.from_service_account_file(
    service_account_key_file, scopes=['https://www.googleapis.com/auth/calendar.readonly'])

calendar_service = build('calendar', 'v3', credentials=creds)

# Load existing events from the JSON file
existing_events = load_existing_events('.github/workflow-helpers/calendar_events.json')

# Get events from the Google Calendar
now = datetime.utcnow().isoformat() + 'Z'
# Set now to march first 2022
now = '2022-03-01T00:00:00Z'
events_results = calendar_service.events().list(calendarId=calendar_id,
                                                timeMin=now,
                                                maxResults=50,
                                                singleEvents=True,
                                                orderBy='startTime').execute()

# Update existing events with new or changed events
new_events = events_results.get('items', [])
save_updated_events('.github/workflow-helpers/calendar_events.json', existing_events, new_events)
