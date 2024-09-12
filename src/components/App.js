import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppCSS from './App.module.css';
import Result from './Result';
import Suggestions from './Suggestions';

const Predictor = () => {
  //Variable declarations
  const [userStory, setUserStory] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [activeTab, setActiveTab] = useState('result');
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    Unambiguous: false,
    'Well-formed': false,
    'Full Sentence': false,
  });
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  //function to handle checkbox interactions
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  //Function to fetch suggestions via api and populates corresponding variables.
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

  //Function to handle evaluate button
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userStory.trim()) {
      setErrorMessage('Please enter a user story before submitting.');
      return;
    }

    //Sets error messages
    setErrorMessage('');
    const selected = Object.keys(checkboxes).filter((key) => checkboxes[key]);
    setSelectedCriteria(selected);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        user_story: userStory,
      });
      setPrediction(response.data.prediction);
      setSuggestions(null);
      setHasFetchedSuggestions(false);
      setIsFetchingSuggestions(false);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  //Loading animation?
  useEffect(() => {
    if (activeTab === 'suggestions' && prediction === 0 && !hasFetchedSuggestions) {
      fetchSuggestions();
    }
  }, [activeTab, prediction, hasFetchedSuggestions]);

  return (
    <div className={AppCSS.wrapper}>
      <div className={AppCSS.title}>
        <h1>USER STORY QUALITY EVALUATION</h1>
      </div>
      <div className={AppCSS.container}>
        {/* Textarea field for user story inputs */}
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
          {errorMessage && <p className={AppCSS.error}>{errorMessage}</p>}
          {/* Quality criteria checkboxes */}
          <label>Quality Criteria:</label>
          <div className={AppCSS.criteriaSection}>
            <div className={AppCSS.criteriaItem}>
              <input
                type="checkbox"
                name="Unambiguous"
                checked={checkboxes.Unambiguous}
                onChange={handleCheckboxChange}
              />
              <label>Unambiguous</label>
            </div>
            <div className={AppCSS.criteriaItem}>
              <input
                type="checkbox"
                name="Well-formed"
                checked={checkboxes['Well-formed']}
                onChange={handleCheckboxChange}
              />
              <label>Well-formed</label>
            </div>
            <div className={AppCSS.criteriaItem}>
              <input
                type="checkbox"
                name="Full Sentence"
                checked={checkboxes['Full Sentence']}
                onChange={handleCheckboxChange}
              />
              <label>Full Sentence</label>
            </div>
          </div>
          {/* Evaluate button */}
          <button
            type="submit"
            disabled={isFetchingSuggestions}
          >
            Evaluate
          </button>
        </form>
      </div>
      {/* This section is a navigation to evaluation result and suggestions */}
      {prediction !== null && (
        <nav className={AppCSS.nav}>
          <ul>
            <li className={activeTab === 'result' ? AppCSS.active : ''}>
              <span
                className={AppCSS.tab}
                onClick={() => setActiveTab('result')}
              >
                Evaluation Result
              </span>
            </li>
            {prediction === 0 && (
              <li className={activeTab === 'suggestions' ? AppCSS.active : ''}>
                <span
                  className={AppCSS.tab}
                  onClick={() => setActiveTab('suggestions')}
                >
                  Suggestions
                </span>
              </li>
            )}
          </ul>
        </nav>
      )}
      {prediction !== null && (
        <div>
          {activeTab === 'result' && (
            <Result prediction={prediction} selectedCriteria={selectedCriteria} />
          )}
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
