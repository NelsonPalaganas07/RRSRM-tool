from flask import Flask, request, jsonify
import joblib
from transformers import BertTokenizer, BertModel
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load models
svc_model = joblib.load('/Users/jaypalaganas/Desktop/STUDY_FILES/4th year, Sem2/R&D2/RRSRM-tool/backend/SVC Improved/svc_model.joblib')

# Initialize BERT
tokenizer = BertTokenizer.from_pretrained('/Users/jaypalaganas/Desktop/STUDY_FILES/4th year, Sem2/R&D2/RRSRM-tool/backend/SVC Improved/models/saved_bert_model')
bert_model = BertModel.from_pretrained('/Users/jaypalaganas/Desktop/STUDY_FILES/4th year, Sem2/R&D2/RRSRM-tool/backend/SVC Improved/models/saved_bert_model')

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
