from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
from flask_cors import CORS
import os
from serpapi import GoogleSearch
import json
load_dotenv()

client = OpenAI()

app = Flask(__name__)
CORS(app)

MODEL = "gpt-4o"
ITINERARY_PROMPT = '''
You will be provided with a list of travel stops.
You will need to plan an itinerary for the user based on the stops.
Take into account the duration of the stay at each stop, the type of visit, and the number of participants.
Suggest the best order in which to visit the stops based on how convenient it is to travel between them.
Propose the optimal order of stops, and feel free to suggest slight deviations for the number of days,
including when to leave for the next stop (morning, evening...) to make the most of the trip.
'''


tools = [
  {
    "type": "function",
    "function": {
      "name": "search_location",
      "description": "Search for a landmark or hotel at a given location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description":
              "The location to search in, in format City, (State), Country"
          },
          "search_query": {
            "type": "string",
            "description":
              "The query to search for, for example 'boutique hotels' or 'must-see landmarks'"
          }
        },
        "required": ["location", "search_query"],
        "additionalProperties": False
      },
      "strict": True
    }
  },
  {
    "type": "function",
    "function": {
      "name": "plan_itinerary",
      "description": "Plan an itinerary with the given parameters",
      "parameters": {
        "type": "object",
        "properties": {
          "stops": {
            "type": "array",
            "description": "Travel stops",
            "items": {
              "type": "object",
              "properties": {
                "location": {
                  "type": "string"
                },
                "duration": {
                  "type": "number",
                  "description": "Duration in days"
                },
                "type": {
                  "type": "string",
                  "description": "Type of visit: sightseeing, shopping, snorkeling, etc."
                },
                "participants": {
                  "type": "number",
                  "description": "Number of participants"
                }
              },
              "required": ["location", "duration", "type", "participants"]
            }
          }
        }
      }
    }
  }
]

@app.route('/')
def home():
    return "Server is running"

@app.route('/get_response', methods=['POST'])
def get_response():
    data = request.get_json()
    messages = data['messages']
    print("Incoming messages", messages)
    completion = client.chat.completions.create(
      model=MODEL,
      # System prompt is already included in the messages array
      messages=messages,
      tools=tools
    )
    response_message = completion.choices[0].message
    return jsonify(response_message)

@app.route('/search_location', methods=['POST'])
def search_location():
    data = request.get_json()
    location = data['location']
    search_query = data['search_query']

    serpApiKey = os.getenv('SERPAPI_API_KEY')
    if not serpApiKey:
      raise ValueError('SERPAPI_API_KEY is not defined')
    
    params = {
        "engine": "google",
        "q": search_query,
        "location": location,
        "api_key": serpApiKey,
        "limit": 5
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    organic_results = results["organic_results"]
    return organic_results

@app.route('/plan_itinerary', methods=['POST'])
def plan_itinerary():
    data = request.get_json()
    stops = data['stops']
    print("Planning itinerary", stops)
    completion = client.chat.completions.create(
      model="o1",
      messages=[
        {"role": "system", "content": ITINERARY_PROMPT},
        {"role": "user", "content": json.dumps(stops)}
      ]
    )
    return jsonify({"itinerary": completion.choices[0].message.content})

if __name__ == '__main__':
    # Debug mode should be set to False in production
    app.run(debug=True, port=8000)