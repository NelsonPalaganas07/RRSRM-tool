import React, { useState } from 'react';
import axios from 'axios';
import AppCSS from './App.module.css';
import Result from './Result.js';

const Predictor = () => {
  const [userStory, setUserStory] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [activeTab, setActiveTab] = useState('result');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        user_story: userStory
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  return (
<div>
  <div className={AppCSS.title}>
    <h1>USER STORY PREDICTOR</h1>
  </div>
  <div className={AppCSS.container}>
  <form onSubmit={handleSubmit}>
    <label>
      Enter User Story:
      <textarea
        value={userStory}
        
        onChange={(e) => setUserStory(e.target.value)}
        rows="6"
        cols="50"
      />
    </label>
    <button type="submit">Predict</button>
  </form>
  </div>
  {prediction !== null && (
        <nav className={AppCSS.nav}>
          <ul>
            <li className={activeTab === 'result' ? AppCSS.active : ''}>
              <button onClick={() => setActiveTab('result')}>Result</button>
            </li>
            <li className={activeTab === 'suggestions' ? AppCSS.active : ''}>
              <button onClick={() => setActiveTab('suggestions')}>Suggestions</button>
            </li>
          </ul>
        </nav>
      )}

      {prediction !== null && (
        <div>
          {activeTab === 'result' && <Result prediction={prediction} />}
          {/* {activeTab === 'suggestions' && <Suggestions prediction={prediction} />} */}
        </div>
      )}
</div>
  );
};

export default Predictor;