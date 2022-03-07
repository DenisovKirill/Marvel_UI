import { Component } from "react/cjs/react.development";

import classNames from "classnames";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

class CharList extends Component {
    state = {
        chars: [],
        loading: false,
        error: false,
    };

    marvelService = new MarvelService();

    onCharsLoaded = (chars) => {
        this.setState({ chars, loading: false });
    };

    onCharsLoading = () => {
        this.setState({ loading: true });
    };

    onError = () => {
        this.setState({ loading: false, error: true });
    };

    componentDidMount() {
        this.onCharsLoading();
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    renderCharList = (arr) => {
        const items = arr.map((char) => {
            return (
                <CharItem
                    key={char.id}
                    thumbnail={char.thumbnail}
                    name={char.name}
                />
            );
        });

        return <ul className="char__grid">{items}</ul>;
    };

    render() {
        const { chars, loading, error } = this.state;

        const items = this.renderCharList(chars);
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage /> : null;
        const content = !loading && !error ? items : null;
        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

const CharItem = ({ thumbnail, name }) => {
    const defaultImg =
        thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
    const imgClass = classNames({
        "char__item-img": true,
        "img-default": defaultImg,
    });
    return (
        <li className="char__item">
            <img className={imgClass} src={thumbnail} alt="abyss" />
            <div className="char__name">{name}</div>
        </li>
    );
};

export default CharList;
