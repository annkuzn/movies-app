import React from 'react';
import PropTypes from 'prop-types';

import './genres.css';

import { Consumer } from '../context';


const Genres = ({ genresIds}) => {

    return (
        <Consumer>
            {
                ({genres}) => {

                    const movieGenres = genresIds ? genres.filter(genre => {
                        let result = false;
                        genresIds.forEach(item => {
                            if (genre.id === item) {
                                result = true;
                            }
                        })
                        return result;
                    }) : null
                
                    const currentGenres = movieGenres ? movieGenres.map( item => {
                        return (
                            <li className='movies__genre'>{item.name}</li>
                        )
                    }) : null

                    return (
                        <div className='movies__genresList__block'>
                            <ul className='movies__genres__list'>
                                {currentGenres}
                            </ul>
                        </div>
                    )
                }
            }
        </Consumer>
    )
        
}

export default Genres;

Genres.defaultProps = {
    genresIds: null
};

Genres.propTypes = {
    genresIds: PropTypes.arrayOf(PropTypes.number)
}