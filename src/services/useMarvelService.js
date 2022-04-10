import useHttp from "../hooks/http.hook";

const useMarvelService = () => {
    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=dacb340d88809795d1cd84904eb76b25";
    const _charsOffset = 210;
    const _comicsOffset = 210;
    const _charsLimit = 9;
    const _comicsLimit = 8;

    const { loading, error, request, clearError } = useHttp();

    const getAllCharacters = async (offset = _charsOffset) => {
        const res = await request(
            `${_apiBase}characters?limit=${_charsLimit}&offset=${offset}&${_apiKey}`
        );
        // return res.data.results.map(char => _transformCharacter(char));
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    };

    const getAllComics = async (offset = _comicsOffset) => {
        const res = await request(
            `${_apiBase}comics?orderBy=issueNumber&limit=${_comicsLimit}&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformComics);
    };
    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    };

    const _transformCharacter = (char) => {
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
            comics: char.comics.items.slice(0, 10),
        };
    };

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "No description available",
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            pageCount: comics.pageCount
                ? `${comics.pageCount} p.`
                : "No information about the number of pages",
            language: comics.textObjects.language || "en-us",
            price: comics.prices[0].price
                ? `${comics.prices[0].price}$`
                : "not available",
        };
    };

    return {
        loading,
        error,
        clearError,
        getAllCharacters,
        getCharacter,
        getAllComics,
        getComic,
    };
};

export default useMarvelService;
