import MovieApi from './movie-api';

export default class SessionData {

    movieApi = new MovieApi();

    sessionId = null;

    async getSessionId() {
        return this.movieApi.getResource('authentication/guest_session/new')
        .then(async res => {
            this.sessionId = await res.guest_session_id;
            return this.sessionId;
        });
    };
};