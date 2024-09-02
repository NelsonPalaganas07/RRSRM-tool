import React from 'react';
import styles from './Suggestions.module.css';

const Suggestions = ({ suggestions, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.suggestionsContainer}>
        <div className={styles.loader}></div>
        <p className={styles.fetchingText}>Looking for suggestions...</p>
      </div>
    );
  }

  if (!suggestions) {
    return (
      <div className={styles.suggestionsContainer}>
        <p className={styles.noSuggestions}>No suggestions available.</p>
      </div>
    );
  }

  return (
    <div className={styles.suggestionsContainer}>
      <h2 className={styles.suggestionsTitle}>Improvement Suggestions</h2>
      <div className={styles.suggestionList}>
        {suggestions.length > 0 ? (
          suggestions.split('\n').map((suggestion, index) => (
            <div key={index} className={styles.suggestionItem}>
              {suggestion}
            </div>
          ))
        ) : (
          <p className={styles.noSuggestions}>No suggestions found.</p>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
