import React from 'react';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';

import Movie from '../movie/movie';
import Alert from '../alert/alert';

const MoviesList = ({ tab, error, loading, ratedMovies, searchMovies, pushRatedMovie }) => {
    const data = tab === 1 ? searchMovies : ratedMovies;

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
                    
    const alert = <Alert
                        tab={tab}
                        data={data}
                        error={error}
                        loading={loading}
                    />

    return ( 
        <ul className="movies__list">
            {(!error && !loading && movies) ? movies : alert}
        </ul>
    )
}

export default MoviesList;

MoviesList.defaultProps = {
    tab: 1,
    error: false,
    loading: true,
    ratedMovies: [],
    searchMovies: [],
    pushRatedMovie: (() => {}),
}

MoviesList.propTypes = {
    tab: PropTypes.number,
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    loading: PropTypes.bool,
    ratedMovies: PropTypes.arrayOf(PropTypes.object),
    searchMovies: PropTypes.arrayOf(PropTypes.object),
    pushRatedMovie: PropTypes.func,
}
