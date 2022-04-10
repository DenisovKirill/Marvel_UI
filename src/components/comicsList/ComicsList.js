import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/useMarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./comicsList.scss";

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const { loading, error, getAllComics } = useMarvelService();
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);

    const limit = 8;

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if (newComics.lengh < limit) {
            ended = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setOffset(offset => offset + limit);
        setNewItemsLoading(false);
        setComicsEnded(ended);
    };

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllComics(offset).then(onComicsLoaded);
    };

    // eslint-disable-next-line
    useEffect(() => onRequest(offset, true), []);

    const renderComicsList = (arr) => {
        const items = arr.map(item => {
            return (
                <ComicItem
                    key={item.id}
                    link={`comics/${item.id}`}
                    thumbnail={item.thumbnail}
                    title={item.title}
                    price={item.price}
                />
            );
        });

        return <ul className="comics__grid">{items}</ul>;
    };

    const items = renderComicsList(comics);
    const spinner = loading && !newItemsLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{ display: comicsEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

const ComicItem = (props) => {
    const { link, thumbnail, title, price } = props;
    return (
        <li className="comics__item">
            <Link to={link}>
                <img src={thumbnail} alt={title} className="comics__item-img" />
                <div className="comics__item-name">{title}</div>
                <div className="comics__item-price">{price}</div>
            </Link>
        </li>
    );
};

export default ComicsList;
