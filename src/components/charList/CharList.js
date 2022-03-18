import { Component } from "react/cjs/react.development";
import propTypes from "prop-types";

import classNames from "classnames";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charEnded: false,
    };

    limit = 9;

    marvelService = new MarvelService();

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < this.limit) {
            ended = true;
        }

        this.setState(({ chars, offset }) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemsLoading: false,
            offset: offset + this.limit,
            charEnded: ended,
        }));
    };

    onNewCharsLoading = () => {
        this.setState({ newItemsLoading: true });
        console.log(this.state.newItemsLoading);
    };

    onError = () => {
        this.setState({ loading: false, error: true });
    };

    onRequest = (offset) => {
        this.onNewCharsLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    };

    componentDidMount() {
        this.onRequest();
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderCharList = (arr) => {
        const items = arr.map((char, i) => {
            return (
                <CharItem
                    key={char.id}
                    reff={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(char.id);
                        this.focusOnItem(i);
                    }}
                    thumbnail={char.thumbnail}
                    name={char.name}
                />
            );
        });

        return <ul className="char__grid">{items}</ul>;
    };

    render() {
        const { chars, loading, error, newItemsLoading, offset, charEnded } =
            this.state;

        const items = this.renderCharList(chars);
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage /> : null;
        const content = !loading && !error ? items : null;
        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    style={{ display: charEnded ? "none" : "block" }}
                    onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

class CharItem extends Component {
    defaultImg =
        this.props.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
    imgClass = classNames({
        "char__item-img": true,
        "img-default": this.defaultImg,
    });

    render() {
        const { onClick, name, thumbnail, reff } = this.props;
        return (
            <li className="char__item" onClick={onClick} ref={reff}>
                <img className={this.imgClass} src={thumbnail} alt="abyss" />
                <div className="char__name">{name}</div>
            </li>
        );
    }
};

CharList.propTypes = {
    onCharSelected: propTypes.func.isRequired
};

export default CharList;
