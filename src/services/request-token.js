
import MovieApi from './movie-api';

export default class RequestToken {

    movieApi = new MovieApi();

    getToken() {
        return fetch(`${this.movieApi.apiBase}authentication/token/new?api_key=${this.movieApi.apiKey}`)
         .then(res => res.json())
         .then(res => res.request_token);
    };

    getSessionId(token) {
        return fetch(`${this.movieApi.apiBase}authentication/session/new?api_key=${this.movieApi.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"request_token":token}),
                })
        .then(res => res.json())
        .then(res => res.session_id);
    }

    redirection(token) {
        window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${window.location.href}`;
    }

    getAccauntId(id) {
        return fetch(`${this.movieApi.apiBase}account?api_key=${this.movieApi.apiKey}&session_id=${id}`)
        .then(res => res.json())
        .then(res => res.id);
    }
} 