import React, { useState } from 'react';
import ResultCSS from './Result.module.css';

// Definitions for pop-up field.
const criteriaDefinitions = {
  'Unambiguous': 'User stories should be clear and avoid misunderstandings, both within themselves and compared to other stories.' +
  ' In terms of semantics, a sentence could mean many things which could result in different tasks being worked on. ',
  'Ambiguous': 'User stories should be clear and avoid misunderstandings, both within themselves and compared to other stories.' +
  ' In terms of semantics, a sentence could mean many things which could result in different tasks being worked on. ',

  'Well-formed': 'Before it can be considered a user story, the core text of the requirement needs to include a role and the expected functionality. ' +
  'A good quality will have all 3 aspects: role functionality, and purpose. The aspects are described well.' + 
  ' A poor-quality user story can have one of the things missing, or ambiguous, or poorly described. ',
  'Not Well-formed': 'Before it can be considered a user story, the core text of the requirement needs to include a role and the expected functionality. ' +
  'A good quality will have all 3 aspects: role functionality, and purpose. The aspects are described well.' + 
  ' A poor-quality user story can have one of the things missing, or ambiguous, or poorly described. ',

  'Full Sentence': 'A user story should read like a full sentence, without typos or grammatical errors.' + 
  ' Without Grammatical errors, the user story becomes clearer and easier to understand for many people, therefore making it more interpretable. ',
  'Not a Full Sentence': 'A user story should read like a full sentence, without typos or grammatical errors.' + 
  ' Without Grammatical errors, the user story becomes clearer and easier to understand for many people, therefore making it more interpretable. ',
};

const Result = ({ prediction, selectedCriteria }) => {
  const [hoveredCriteria, setHoveredCriteria] = useState(null);

  // Algorithm to show whether it is Unambiguous or Ambiguous. Currently, Well-formed and Full Sentence are not implemented yet and is 
  // based off the result from Unambiguous model.
  const getResult = () => {
    const results = [];
    if (selectedCriteria.includes('Unambiguous')) {
      results.push(prediction === 1 ? 'Unambiguous' : 'Ambiguous');
    }
    if (selectedCriteria.includes('Well-formed')) {
      results.push(prediction === 1 ? 'Well-formed' : 'Not Well-formed');
    }
    if (selectedCriteria.includes('Full Sentence')) {
      results.push(prediction === 1 ? 'Full Sentence' : 'Not a Full Sentence');
    }
    
    //To show the result and have a question mark icon for definition pop-ups.
    return results.map((result, index) => {
      return (
        <div key={index} className={ResultCSS.resultItem}>
          {result}
          <span
            className={ResultCSS.questionMark}
            onMouseEnter={() => setHoveredCriteria(result)}
            onMouseLeave={() => setHoveredCriteria(null)}
          >
            ?
          </span>
          {hoveredCriteria === result && (
            <div className={ResultCSS.definition}>
              {criteriaDefinitions[result]}
            </div>
          )}
          <br />
        </div>
      );
    });
  };

  return (
    <div>
      <h2 className={prediction === 1 ? ResultCSS.h2succ : ResultCSS.h2fail}>
        {getResult()}
      </h2>
    </div>
  );
};

export default Result;
