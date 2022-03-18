class MarvelService {
    _apiBase = "https://gateway.marvel.com:443/v1/public/";
    _apiKey = "apikey=dacb340d88809795d1cd84904eb76b25";
    _baseOffset = 210;
    _limit = 9;

    getResourse = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResourse(
            `${this._apiBase}characters?limit=${this._limit}&offset=${offset}&${this._apiKey}`
        );
        // return res.data.results.map(char => this._transformCharacter(char));
        return res.data.results.map(this._transformCharacter);
    };

    getCharecter = async (id) => {
        const res = await this.getResourse(
            `${this._apiBase}characters/${id}?${this._apiKey}`
        );
        return this._transformCharacter(res.data.results[0]);
    };

    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description
                ? char.description.length < 200
                    ? char.description
                    : `${char.description.slice(0, 200)}...`
                : "No description available",
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0, 10)
        };
    };
}

export default MarvelService;
