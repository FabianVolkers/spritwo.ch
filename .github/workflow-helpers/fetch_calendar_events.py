import os
import json
import pytz
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from bs4 import BeautifulSoup


def load_existing_events(file_path):
    try:
        with open(file_path, 'r') as f:
            print(f"Loading existing events from {file_path}")
            return json.load(f)
    except FileNotFoundError:
        return {}

def clean_event_description(description):

    if not description:
        return
    
    soup = BeautifulSoup(description, 'html.parser')
    return soup.get_text()

def separate_location(location):
    location = location.split(',')
    location_name = location[0].strip()
    location_address = ','.join(location[1:]).strip()
    return location_name, location_address

def save_updated_events(file_path, existing_events, new_events):
    updated_events = {}
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

        # Clean up HTML in event description
        description = new_event.get('description')
        if description:
            new_event['description_html'] = description
            new_event['description'] = clean_event_description(description)

        # Store location name and address separately
        location = new_event.get('location')
        if location:
            if ',' not in location:
                new_event['location_name'] = location
                new_event['location_address'] = 'Lohmühlenstraße 65, 12435 Berlin, Germany'
            else:
                new_event['location_name'], new_event['location_address'] = separate_location(location)

        updated_events[event_id] = new_event
        print(f"Adding new event {event_id} {new_event['summary']}")

    # Retain past events that are not in the new events list and are outside the requested time range
    now = datetime.utcnow()
    now = now.astimezone(pytz.utc)
    for event_id, event in existing_events.items():
        event_start = event['start'].get('dateTime') or event['start'].get('date')
        event_timezone = event['start'].get('timeZone')
        event_start = datetime.fromisoformat(event_start)
        if event_timezone:
            timezone = pytz.timezone(event_timezone)
            event_start = event_start.astimezone(timezone)

        # # Clean up HTML in event description
        # event['description_html'] = event.get('description', '')
        # event['description'] = clean_event_description(event)

        if event_id not in updated_events and event_start < now:
            updated_events[event_id] = event
            print(f"Retaining past event {event_id} {event['summary']}")

    with open(file_path, 'w') as f:
        json.dump(updated_events, f, indent=2)


# Set up Google Calendar API
calendar_id = os.environ["GOOGLE_CALENDAR_ID"]
service_account_key_file = "service_account_key.json"

creds = service_account.Credentials.from_service_account_file(
    service_account_key_file, scopes=['https://www.googleapis.com/auth/calendar.readonly'])

calendar_service = build('calendar', 'v3', credentials=creds)

# Load existing events from the JSON file
file_path = os.environ["EVENTS_JSON_FILE"]
existing_events = load_existing_events(file_path)
print(f"Found {len(existing_events)} existing events")

# Get events from the Google Calendar
start_date_str = os.environ.get("START_DATE")
if start_date_str:
    start_date = datetime.fromisoformat(start_date_str).isoformat() + 'Z'
else:
    start_date = datetime.utcnow().isoformat() + 'Z'
print(f'Getting the upcoming 50 events from {start_date}')
events_results = calendar_service.events().list(calendarId=calendar_id,
                                                timeMin=start_date,
                                                maxResults=50,
                                                singleEvents=True,
                                                orderBy='startTime').execute()

# Update existing events with new or changed events
new_events = events_results.get('items', [])
print(f"Found {len(new_events)} new events")

save_updated_events(file_path, existing_events, new_events)
