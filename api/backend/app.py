from flask import Flask, request, jsonify
import joblib
from transformers import BertTokenizer, BertModel
import numpy as np
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Define the base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define paths to model files
SVC_MODEL_PATH = os.path.join(BASE_DIR, 'models/svc_model.joblib')
TOKENIZER_PATH = os.path.join(BASE_DIR, 'models/saved_bert_model')

# Load models
svc_model = joblib.load(SVC_MODEL_PATH)

# Initialize BERT
tokenizer = BertTokenizer.from_pretrained(TOKENIZER_PATH)
bert_model = BertModel.from_pretrained(TOKENIZER_PATH)

def extract_features(user_story):
    inputs = tokenizer(user_story, return_tensors='pt', padding=True, truncation=True)
    outputs = bert_model(**inputs)
    features = outputs.last_hidden_state.mean(dim=1).detach().numpy()
    return features

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_story = data['user_story']
    
     # Extract features using BERT
    features = extract_features(user_story)
    
    # Predict with SVC
    prediction = svc_model.predict(features)
    
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
