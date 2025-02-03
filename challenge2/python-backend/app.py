from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
from flask_cors import CORS
import os
from serpapi import GoogleSearch
load_dotenv()

client = OpenAI()

app = Flask(__name__)
CORS(app)

MODEL = "gpt-4o"

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

if __name__ == '__main__':
    # Debug mode should be set to False in production
    app.run(debug=True, port=8000)
