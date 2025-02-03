from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
from flask_cors import CORS
load_dotenv()

client = OpenAI()

app = Flask(__name__)
CORS(app)

MODEL = "gpt-4o"

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
      messages=messages
    )
    response_message = completion.choices[0].message
    return jsonify(response_message)

if __name__ == '__main__':
    # Debug mode should be set to False in production
    app.run(debug=True, port=8000)
