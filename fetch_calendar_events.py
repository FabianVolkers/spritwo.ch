import os
import json
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Set up Google Calendar API
calendar_id = os.environ["GOOGLE_CALENDAR_ID"]
api_key = os.environ["GOOGLE_API_KEY"]

calendar_service = build('calendar', 'v3', developerKey=api_key)

# Get events from the Google Calendar
now = datetime.utcnow().isoformat() + 'Z'
events_results = calendar_service.events().list(calendarId=calendar_id,
                                                timeMin=now,
                                                maxResults=50,
                                                singleEvents=True,
                                                orderBy='startTime').execute()

# Write events to a JSON file
events = events_results.get('items', [])
with open('calendar_events.json', 'w') as f:
    json.dump(events, f, indent=2)
