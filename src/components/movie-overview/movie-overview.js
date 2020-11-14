import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './movie-overview.css';

export default class MovieOverview extends Component{

    static defaultProps = {
        overview: null,
        ind: 0
    };
    
    static propTypes = {
        overview: PropTypes.string,
        ind: PropTypes.number
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
        const { ind } = this.props;
        const titles = document.querySelectorAll('.movie__name');

        const lineHeight = 31;
        const currentTitle = titles[ind-1];
        const numberOfTitleLines = currentTitle.clientHeight / lineHeight

        let result = overview;

        const maxLengthOverview = 300;
        const numberHiddenSymbols = 80; // number of hidden overviews characters with one titles line

        const length = maxLengthOverview - numberOfTitleLines * numberHiddenSymbols;

        if (overview.length > length) {
            const newDescr = overview.substr(0, length);
            const index = newDescr.lastIndexOf(' ');

            result = `${newDescr.substr(0, index)}...`;
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