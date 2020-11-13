import MovieApi from './movie-api';

export default class SessionData {

    movieApi = new MovieApi();

    sessionId = null;

    async getSessionId() {
        const result = await fetch(`${this.movieApi.apiBase}authentication/guest_session/new?api_key=${this.movieApi.apiKey}`)
        .then(res => res.json())
        .then(async res => {
            this.sessionId = await res.guest_session_id;
            return this.sessionId;
        });

        return result;
    };
};