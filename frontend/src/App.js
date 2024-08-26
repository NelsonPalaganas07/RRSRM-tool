import React, { useState } from 'react';
import axios from 'axios';

const Predictor = () => {
  const [userStory, setUserStory] = useState('');
  const [prediction, setPrediction] = useState(null);

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
  <h1>Predict User Story</h1>
  <form onSubmit={handleSubmit}>
    <label>
      User Story:
      <textarea
        value={userStory}
        onChange={(e) => setUserStory(e.target.value)}
        rows="4"
        cols="50"
      />
    </label>
    <button type="submit">Predict</button>
  </form>
  {prediction !== null && <div>Prediction: {prediction}</div>}
</div>
  );
};

export default Predictor;