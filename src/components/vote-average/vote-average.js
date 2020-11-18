import React from 'react';
import PropTypes from 'prop-types';

import './vote-average.css';


const VoteAverage = ({ voteAverage }) => {

    let borderColor;

    if(voteAverage < 3) {
        borderColor = '#E90000';
    } else if (voteAverage < 5) {
        borderColor = '#E97E00';
    } else if (voteAverage < 7) {
        borderColor = '#E9D100';
    } else {
        borderColor = '#66E900';
    };

    return (
        <div className='movie__voteAverage' style={{ border: `2px solid ${borderColor}`}}>
            <span>{voteAverage}</span>
        </div>
    );
};

VoteAverage.defaultProps = {
    voteAverage: 0
};

VoteAverage.propTypes = {
    voteAverage: PropTypes.number
};

export default VoteAverage;