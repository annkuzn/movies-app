import React from 'react';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';

import Movie from '../movie/movie';

const MoviesList = ({ error, loading, ratedMovies, data, pushRatedMovie }) => {
    let key = 0;
    const movies =  data.length ? data.map((movie) => {
                        key += 1;
                        return (
                            <li key={key.toString()} className='movie'>
                                <Movie
                                    ind={key}
                                    movie={movie} 
                                    ratedMovies={ratedMovies}
                                    pushRatedMovie={pushRatedMovie}
                                />
                            </li>
                        )
                    }) : null;           

    return ( 
        <>
            <ul className="movies__list">
            {(error || loading) ? null : movies}
            </ul>
        </>
        
    )
}

export default MoviesList;

MoviesList.defaultProps = {

    data: null,
    error: false,
    loading: true,
    ratedMovies: [],
    pushRatedMovie: (() => {}),
}

MoviesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    loading: PropTypes.bool,
    ratedMovies: PropTypes.arrayOf(PropTypes.object),
    pushRatedMovie: PropTypes.func,
}
