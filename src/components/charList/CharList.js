import { useState, useEffect, useRef } from "react";
import propTypes from "prop-types";

import classNames from "classnames";

import useMarvelService from "../../services/useMarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

const CharList = (props) => {
    const { loading, error, getAllCharacters } = useMarvelService();

    const [chars, setChars] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const limit = 9;

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < limit) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setNewItemsLoading(false);
        setOffset(offset => offset + limit);
        setCharEnded(ended);
    };

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllCharacters(offset)
            .then(onCharsLoaded)
    };

     // eslint-disable-next-line
    useEffect(() => onRequest(offset, true), []);

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderCharList = (arr) => {
        const items = arr.map((char, i) => {
            return (
                <CharItem
                    key={char.id}
                    reff={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(char.id);
                        focusOnItem(i);
                    }}
                    thumbnail={char.thumbnail}
                    name={char.name}
                />
            );
        });

        return <ul className="char__grid">{items}</ul>;
    };

    const items = renderCharList(chars);
    const spinner = loading && !newItemsLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{ display: charEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );

}

const CharItem = (props) => {
    const defaultImg =
        props.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
    const imgClass = classNames({
        "char__item-img": true,
        "img-default": defaultImg,
    });

        const { onClick, name, thumbnail, reff } = props;
        return (
            <li className="char__item" onClick={onClick} ref={reff}>
                <img className={imgClass} src={thumbnail} alt="abyss" />
                <div className="char__name">{name}</div>
            </li>
        );
};

CharList.propTypes = {
    onCharSelected: propTypes.func.isRequired
};

export default CharList;
