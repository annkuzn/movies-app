import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import './movie.css';


const Movie = ({movie}) => {

    const cutDescr = (descr) => {
        let result = descr;

        if(descr.length > 235) {
            const newDescr = descr.substr(0, 235);
            const ind = newDescr.lastIndexOf(' ');

            result = `${newDescr.substr(0, ind)}...`;
        }

        return result;
    }

    return (
        <div className='movies__div'>
            <div>
                <img className='movies__img' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </div>
            <div className='movies__details'>
                <h1 className='movies__name'>{movie.title}</h1>
                <span className='movies__date'>{format(new Date(movie.release_date), 'LLLL d, y')}</span>
                <span className='movies__genre'>Action</span>
                <p className='movies__descr'>{cutDescr(movie.overview)}</p>
            </div>
        </div>
    )
}

export default Movie;

Movie.defaultProps = {
    movie: []
}

Movie.propTypes = {
    movie: PropTypes.arrayOf(PropTypes.object)
}