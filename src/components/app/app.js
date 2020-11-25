import React, { Component } from 'react';
import { Tabs, Spin, Alert} from 'antd';

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
        request: null,
        searchMovies: [],
        ratedMovies: [],
        currentPage: 1,
        loading: false,
        error: false,
        totalPages: 1,
        tab: 1,
        genres: null,
    };

    timer = null;

    componentDidMount() {   
        this.movieApi.getSessionId();   

        this.movieApi.getGenres()
        .then(res => {
            this.setState({
                genres: res.genres
            });
        });
    };

    componentDidUpdate(prevProp, prevState) {
        const { request, currentPage, tab, ratedMovies } = this.state;

        if (prevState.tab !== tab || prevState.request !== request || prevState.currentPage !== currentPage) {
            this.changeLoading(true);

            if (tab === 1) {

                if (request) {
                    const func = this.movieApi.getMovies(currentPage, prevState.request, request);
                    this.searchMovies(func);
                } else {
                    this.changeLoading(false);
                    this.onError(false);
                }
            } else if (tab === 2) {
                this.changeLoading(false);
                if (!ratedMovies.length) this.onError('Пока нет оцененных фильмов');
            };
            
        };
    };

    componentDidCatch(err){
        this.onError(err.message);
    };

    removeRequest = () => {
        this.setState({
            request: null
        });
    };

    changeLoading = (load) => {
        this.setState({
            loading: load
        });
    };

    searchMovies = (func) => {
        const { currentPage } = this.state;

        func.then(([ movies, pages, curPage ])=> {

            this.setState({
                searchMovies: movies,
                loading: false,
                error: false,
                totalPages: pages,
                currentPage: curPage || currentPage
            });
        })
        .catch((err) => {this.onError(err.message)}); 
    };
 
    onError = (message) => {
        this.setState({
            error: message,
            loading: false
        });
    };

    changePage = page => {
        this.setState({
            currentPage: page,
        });
      };    

    updateRequest = (newRequest) => {
        this.setState({
            request: newRequest.target.value.trim()
        });
    };

    pushRatedMovie = (movie) => {
        const { ratedMovies } = this.state;
        let newMovie = true;

        const newArr = ratedMovies.map(mov => {

            if (mov.id === movie.id) {
                newMovie = false;
                return {...mov, rating: movie.rating};
            }

            return mov;
        })

        this.setState({
            ratedMovies: newMovie ? [...newArr, movie] : [...newArr]
        });
    };

    updateSearchTab = (tabKey) => {
        const numberTab = +tabKey;

        this.setState({
            tab: numberTab,
            loading: true,
        });
    };
 
    tabClickHandler = (tabKey) => {
        this.updateSearchTab(tabKey);
    };

    paginationChangeHandler = (page) => {
        this.changePage(page);
    };

    render () {

        const { searchMovies, ratedMovies, loading, error, currentPage, totalPages, genres, tab } = this.state;
        const className = tab === 1 ? "Search" : "Rated";
        const { TabPane } = Tabs;
        const data = tab === 1 ? searchMovies : ratedMovies;

        const searchInput = <SearchInput updateRequest={this.updateRequest} />;

        const paginationSearchMovies = <Pagination
                                            defaultPageSize={20}
                                            totalPages={totalPages}
                                            currentPage={currentPage}
                                            paginationChangeHandler={this.paginationChangeHandler}
                                        />
        
        const spinner = <div className="spin">
                            <Spin size='large' />
                        </div>;
                
        const errorMessage = <Alert
                                message="Ошибка"
                                description={error}
                                type="error"
                             />;

        const infoMessage = <Alert 
                                className="infoMessage"
                                message="Введите запрос"
                                type="info"
                            />

        const message = error ? errorMessage : infoMessage;

        const input = tab === 1 ? searchInput : null;

        const pagination = (!data.length || tab === 2 || loading) ? null : paginationSearchMovies;

        return (
            <Provider value={genres}>
                <Tabs defaultActiveKey="1" centered onTabClick={this.tabClickHandler}>
                    <TabPane tab="Search" key="1" />
                    <TabPane tab="Rated" key="2" />
                </Tabs>
                <Section 
                    data={data}
                    error={error}
                    input={input}
                    loading={loading}
                    spinner={spinner}
                    message={message}
                    className={className}
                    pagination={pagination}
                    ratedMovies={ratedMovies}
                    pushRatedMovie={this.pushRatedMovie}
                />
            </Provider>
        );
    };
};
