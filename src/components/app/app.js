import React, { Component } from 'react';
import { Tabs, Spin, Alert } from 'antd';

import 'antd/dist/antd.css';
import './app.css';

import { Provider } from '../../context';
import Section from '../section/section';
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
        this.setState({error: message});
    };

    changePage = (page) => {
        this.setState({currentPage: page});
    };    

    updateRequest = (newRequest) => {
        this.setState({request: newRequest.target.value.trim()});
    };

    pushRatedMovie = (movie) => {
        const { ratedMovies } = this.state;

        const newRatedMovies = ratedMovies.reduce((acc, item, index, arr) => {
            if (item.id === movie.id) return [...acc, movie];

            return (index === arr.length - 1) ? [...acc, item, movie] : [...acc, item]; 
        }, []);

        this.setState({ratedMovies: ratedMovies.length === 0 ? [movie] : newRatedMovies});
    };

    updateSearchTab = (tabKey) => {
        const numberTab = +tabKey;

        this.setState({tab: numberTab});
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
        const createAlert = (type, message, descr) => {
            return <Alert
                        type={type}
                        message={message}
                        description={descr}
                    />
        };

        const searchInput = <SearchInput updateRequest={this.updateRequest} />;

        const paginationSearchMovies = <Pagination
                                            defaultPageSize={20}
                                            totalPages={totalPages}
                                            currentPage={currentPage}
                                            paginationChangeHandler={this.paginationChangeHandler}
                                        />
        
        const spinner = <div className="spin">
                            <Spin size="large" />
                        </div>;
        
        const { infoMessage, input, className, data } = tab === 1 ? {
            data: searchMovies,
            input: searchInput,
            className: "Search",    
            infoMessage: "Введите запрос",  
        } : {
            data: ratedMovies,
            input: null,
            className: "Rated",
            infoMessage: "Пока нет оцененных фильмов",  
        };

        const alert = error ? createAlert("error", "Ошибка", error) : createAlert("info", infoMessage);
        const pagination = (!data.length || tab === 2 || loading) ? null : paginationSearchMovies;

        return (
            <Provider value={genres}>
                <Tabs defaultActiveKey="1" centered onTabClick={this.tabClickHandler}>
                    <TabPane tab="Search" key="1" />
                    <TabPane tab="Rated" key="2" />
                </Tabs>
                {input}
                <Section 
                    data={data}
                    error={error}
                    alert={alert}
                    loading={loading}
                    spinner={spinner}
                    className={className}
                    ratedMovies={ratedMovies}
                    pushRatedMovie={this.pushRatedMovie}
                />
                <div className='movies__pagination'>{pagination}</div>
            </Provider>
        );
    };
};
