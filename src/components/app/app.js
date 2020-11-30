import React, { Component } from 'react';
import { Tabs, Spin, Alert as AlertAntd  } from 'antd';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';
import './app.css';

import { Provider } from '../../context';
import MoviesList from '../moviesList/moviesList';
import Pagination from '../pagination/pagination';
import SearchInput from '../searchInput/searchInput';
import MovieApi from '../../services/movie-api';

export default class App extends Component {

    movieApi = new MovieApi();

    state = {
        tab: 1,
        request: null,
        genres: null,
        error: false,
        loading: false, 
        ratedMovies: [],
        searchMovies: [],
        currentPage: 1,
        totalPages: 1,
    };

    componentDidMount() {   
        this.movieApi.getSessionId();   

        this.movieApi.getGenres()
        .then(res => {
            this.setState({genres: res.genres});
        });
    };

    componentDidUpdate(prevProp, prevState) {
        const { request, currentPage } = this.state;

        if (prevState.request !== request || prevState.currentPage !== currentPage) {
            this.changeLoading(true);

            const curPage = prevState.request === request ? currentPage : 1;

            if (request) {
                this.movieApi.getMovies(request, curPage)
                .then(([ movies, pages ])=> {
                    this.setState({
                        error: false,
                        loading: false,
                        searchMovies: movies,
                        currentPage: curPage,
                        totalPages: pages,
                    });
                })
                .catch(err => this.onError(err.message));
            } else {
                this.changeLoading(false);
            };
        };
    };

    componentDidCatch(err){
        this.onError(err.message);
    };

    changeLoading = (load) => {
        this.setState({loading: load});
    };
 
    onError = (message) => {
        this.setState({
            error: message,
            loading: false
        });
    };

    changePage = (page) => {
        this.setState({currentPage: page});
    };    

    updateRequest = (newRequest) => {
        this.setState({request: newRequest.target.value.trim()});
    };

    pushRatedMovie = (movie) => {
        const { ratedMovies } = this.state;

        let newMovie = true;

        const newRatedMovies = ratedMovies.map(item => {
            if (item.id === movie.id) {
                newMovie = false;
                return movie;
            }
            return item;
        });

        this.setState({ratedMovies: newMovie ? [...newRatedMovies, movie] : newRatedMovies});
    };

    updateSearchTab = (tabKey) => {
        const numberTab = +tabKey;

        this.setState({
            tab: numberTab,
            error: false
        });
    };
 
    tabClickHandler = (tabKey) => {
        this.updateSearchTab(tabKey);
    };

    paginationChangeHandler = (page) => {
        this.changePage(page);
    };

    render () {
        const { tab, genres, error, loading, ratedMovies, searchMovies, currentPage, totalPages } = this.state;
        const { TabPane } = Tabs;
        const data = tab === 1 ? searchMovies : ratedMovies;

        return (
            <Provider value={genres}>
                <Tabs defaultActiveKey="1" centered onTabClick={this.tabClickHandler}>
                    <TabPane tab="Search" key="1" />
                    <TabPane tab="Rated" key="2" />
                </Tabs>
                <SearchInput
                    tab={tab}
                    updateRequest={this.updateRequest}
                />
                <Spinner load={loading} />
                <Alert
                    tab={tab}
                    data={data}
                    error={error}
                    loading={loading}
                />
                <MoviesList
                    tab={tab}
                    error={error}
                    loading={loading}
                    data={data}
                    ratedMovies={ratedMovies}
                    pushRatedMovie={this.pushRatedMovie}
                />
                <PaginationSearchMovies
                    searchMovies={searchMovies}
                    tab={tab}
                    loading={loading}
                    error={error}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    paginationChangeHandler={this.paginationChangeHandler}
                />
            </Provider>
        );
    };
};

const Spinner = ({ load }) => {
    return load ? <Spin className="spin" size="large" /> : null;
};

const Alert = ({ tab, data, error, loading }) => {
    const type = error ? "error" : "info";
    const infoMessage = tab === 1 ? "Введите запрос" : "Пока нет оцененных фильмов";

    return ((error && !loading) || (!loading && !data.length)) ? (
        <AlertAntd
            type={type}
            message={error ? "Ошибка" : infoMessage}
            description={error}
        /> 
    ) : null;
};

const PaginationSearchMovies = ({ searchMovies, tab, loading, error, totalPages, currentPage, paginationChangeHandler }) => {
    return (searchMovies.length && tab === 1 && !loading && !error) ? (
        <div className='movies__pagination'>
          <Pagination
            defaultPageSize={20}
            totalPages={totalPages}
            currentPage={currentPage}
            paginationChangeHandler={paginationChangeHandler}
        />  
        </div>
    ) : null;
};



Spinner.defaultProps = {
    load: false
};

Spinner.propTypes = {
    load: PropTypes.bool
};

Alert.defaultProps = {
    tab: 1,
    data: [],
    error: false,
    loading: false
};

Alert.propTypes = {
    tab: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.bool,
    loading: PropTypes.bool
};

PaginationSearchMovies.defaultProps = {
    searchMovies: [],
    tab: 1,
    loading: false,
    error: false,
    totalPages: null,
    currentPage: 1,
    paginationChangeHandler: (() => {}),
};

PaginationSearchMovies.propTypes = {
    searchMovies: PropTypes.arrayOf(PropTypes.object),
    tab: PropTypes.number,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    paginationChangeHandler: PropTypes.func,
};