import React from 'react';
import PropTypes from 'prop-types';

import './vote-average.css';


const VoteAverage = ({ voteAverage }) => {

    let voteAverageClass = 'movies__voteAverage movies__voteAverage';

    if(voteAverage < 3) {
        voteAverageClass += 'Red';
    } else if (voteAverage < 5) {
        voteAverageClass += 'Orange';
    } else if (voteAverage < 7) {
        voteAverageClass += 'Yellow';
    } else {
        voteAverageClass += 'Green';
    };

    return (
        <div className={voteAverageClass}>
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