
export default class MovieApi {
    apiBase = 'https://api.themoviedb.org/3/';

    apiKey = '88a91ac04dba011fd615caf2589ff8fb';

    async getResource(url, request, options) {
       
        const res = await fetch(`${this.apiBase}${url}?api_key=${this.apiKey}&${request}`, options);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`);
        };

        return res.json();
    };
}