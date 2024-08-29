import React, { useState } from 'react';
import ResultCSS from './Result.module.css';

const Result = ({prediction}) => {
    const getResult = () => {
        if (prediction === 1) {
            return 'Unambiguous';
        } else if (prediction === 0){
            return 'Ambiguous';
        }
        return null;
    };

    return (
        <div>
            <h2 className={prediction === 1 ? ResultCSS.h2succ : ResultCSS.h2fail}>
                {getResult()}
            </h2>
            
            <div className={ResultCSS.card}>
                <p><strong>Definition:</strong> User stories should be clear and avoid misunderstandings, both within themselves and compared to other stories.
                In terms of semantics, a sentence could mean many things which could result in different tasks being worked on.
                </p>
            </div>
        </div>
    );
};

export default Result;