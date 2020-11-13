import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './movie-overview.css';

export default class MovieOverview extends Component{

    static defaultProps = {
        overview: null,
        numberOfTitleLines: null,
    };
    
    static propTypes = {
        overview: PropTypes.string,
        numberOfTitleLines: PropTypes.number,
    };

    state = {
        overview: null
    };

    componentDidMount() {
        this.updateDescr();

    };

    componentDidUpdate(prevProps) {
        const { overview } = this.props;

        if(prevProps.overview !== overview) {
            this.updateDescr();
        };
    };

    cutDescr = (overview) => {
        const { numberOfTitleLines } = this.props;

        let result = overview;

        const maxLengthOverview = 300;
        const numberHiddenSymbols = 80; // number of hidden overviews characters with one titles line

        const length = maxLengthOverview - numberOfTitleLines * numberHiddenSymbols;

        if (overview.length > length) {
            const newDescr = overview.substr(0, length);
            const ind = newDescr.lastIndexOf(' ');

            result = `${newDescr.substr(0, ind)}...`;
        };

        return result;
    };

    updateDescr = () => {
        const { overview } = this.props;

        this.setState({
            overview: overview ? this.cutDescr(overview) : null
        });
    };
 
    render() {
        const { overview } = this.state;

        return <p className='movie__descr'>{overview}</p>;
    };
};