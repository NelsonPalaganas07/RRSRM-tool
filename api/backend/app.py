from flask import Flask, request, jsonify
import joblib
from transformers import BertTokenizer, BertModel
import numpy as np
from flask_cors import CORS
import os
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate

app = Flask(__name__)
CORS(app)

#Reassemble code
def reassemble_model(chunks_dir, output_file_name):
    output_file = os.path.join(chunks_dir, output_file_name)
    
    with open(output_file, 'wb') as f_out:
        for chunk_file in sorted(os.listdir(chunks_dir)):
            if chunk_file.startswith('chunkmodel'):  # Chunk file name
                with open(os.path.join(chunks_dir, chunk_file), 'rb') as f_in:
                    f_out.write(f_in.read())

# Define the base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define paths to model files
SVC_MODEL_PATH = os.path.join(BASE_DIR, 'models/svc_model.joblib')
TOKENIZER_PATH = os.path.join(BASE_DIR, 'models/saved_bert_model')

#Reassemble model before loading
reassemble_model(TOKENIZER_PATH, 'model.safetensors')

# Load models
svc_model = joblib.load(SVC_MODEL_PATH)

# Initialize BERT
tokenizer = BertTokenizer.from_pretrained(TOKENIZER_PATH)
bert_model = BertModel.from_pretrained(TOKENIZER_PATH)

def get_llm_suggestions(user_story):
    prompt = PromptTemplate(
        input_variables=["user_story"],
        template="""
        You are an expert in improving user stories for software development. I need your help to make the following user story clearer and more actionable. 

        1. Review the user story for any ambiguous or unclear elements.
        2. Provide specific suggestions to make it more precise and unambiguous.

        Here is the user story:

        "{user_story}"

        Please ensure that your suggestions address any potential ambiguities and provide actionable steps to enhance the clarity and effectiveness of the user story. 

        Your response should include:
        - A summary of any ambiguities or unclear elements found in the user story.
        - Detailed recommendations for rewriting or improving the user story.
        - Additional tips or best practices for writing clear and actionable user stories.

        Thank you!
        """
    )
    
    formatted_prompt = prompt.format(user_story=user_story)
    
    try:
        llm = Ollama(model="mistral")
        response = llm.invoke(formatted_prompt)
        print("LLM Response:", response)  # Debugging
        return response
    except Exception as e:
        print(f"Error in LLM call: {type(e).__name__} - {str(e)}")
        return {"error": "Error generating suggestions", "details": str(e)}

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

@app.route('/suggestions', methods=['POST'])
def suggestions():
    data = request.json
    user_story = data['user_story']
    
    try:
        suggestions = get_llm_suggestions(user_story)
        return jsonify({'suggestions': suggestions})
    except Exception as e:
        return jsonify({'error': 'Error generating suggestions', 'details': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
