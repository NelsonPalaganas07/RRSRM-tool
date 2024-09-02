import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppCSS from './App.module.css';
import Result from './Result';
import Suggestions from './Suggestions';

const Predictor = () => {
  const [userStory, setUserStory] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [activeTab, setActiveTab] = useState('result');
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);

  // Function to fetch suggestions
  const fetchSuggestions = async () => {
    setIsFetchingSuggestions(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/suggestions', {
        user_story: userStory,
      });
      setSuggestions(response.data.suggestions);
      setHasFetchedSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  // Handle prediction submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        user_story: userStory,
      });
      setPrediction(response.data.prediction);
      // Reset suggestions when a new prediction is made
      setSuggestions(null);
      setHasFetchedSuggestions(false);
      setIsFetchingSuggestions(false);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  // Effect to fetch suggestions when necessary
  useEffect(() => {
    if (activeTab === 'suggestions' && prediction === 0 && !hasFetchedSuggestions) {
      fetchSuggestions();
    }
  }, [activeTab, prediction, hasFetchedSuggestions]);

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
          <button
            type="submit"
            disabled={isFetchingSuggestions} // Disable if fetching suggestions
          >
            Predict
          </button>
        </form>
      </div>
      {prediction !== null && (
        <nav className={AppCSS.nav}>
          <ul>
            <li className={activeTab === 'result' ? AppCSS.active : ''}>
              <button onClick={() => setActiveTab('result')}>Result</button>
            </li>
            {prediction === 0 && (
              <li className={activeTab === 'suggestions' ? AppCSS.active : ''}>
                <button onClick={() => setActiveTab('suggestions')}>Suggestions</button>
              </li>
            )}
          </ul>
        </nav>
      )}
      {prediction !== null && (
        <div>
          {activeTab === 'result' && <Result prediction={prediction} />}
          {activeTab === 'suggestions' && (
            <Suggestions
              suggestions={suggestions}
              isLoading={isFetchingSuggestions}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Predictor;
