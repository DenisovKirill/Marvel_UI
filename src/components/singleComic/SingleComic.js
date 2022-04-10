import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import useMarvelService from "../../services/useMarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import "./singleComic.scss";

const SingleComic = () => {
    const { comicId } = useParams();
    const [comic, setComic] = useState(null);
    const { loading, error, clearError, getComic } = useMarvelService();

    const updateComic = () => {
        clearError();
        getComic(comicId).then(setComic);
    };

    // eslint-disable-next-line
    useEffect(() => updateComic(), [comicId]);

    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content =  !loading && !error && comic ? <View comic={comic} /> : null;

    return (
    <>
        {spinner}
        {errorMessage}
        {content}
    </>
    );
};

const View = ({ comic }) => {
    const { title, description, price, thumbnail, pageCount, language } = comic;
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">
                Back to all
            </Link>
        </div>
    );
};

export default SingleComic;
