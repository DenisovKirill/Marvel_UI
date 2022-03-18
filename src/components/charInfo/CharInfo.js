import { Component } from "react/cjs/react.development";
import classNames from "classnames";
import propTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Skeleton from "../skeleton/Skeleton";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charInfo.scss";

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
    };

    marvelService = new MarvelService();

    onCharLoading = () => {
        this.setState({ loading: true });
    };

    onCharLoaded = (char) => {
        this.setState({ char, loading: false });
    };

    onError = () => {
        this.setState({ loading: false, error: true });
    };

    updateChar = () => {
        const { charId } = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading();
        this.marvelService
            .getCharecter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    };

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.charId !== this.props.charId) {
            this.updateChar();
        }
    }

    render() {
        const { char, loading, error } = this.state;

        const skeleton = char || loading || error ? null : <Skeleton />;
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage /> : null;
        const content =
            !loading && !error && char ? <View char={char} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        );
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    const defaultImg =
        thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
    const imgClass = classNames({
        "char__basics-img": true,
        "img-default": defaultImg,
    });

    return (
        <>
            <div className="char__basics">
                <img className={imgClass} src={thumbnail} alt="char" />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length
                    ? comics.map((item, i) => {
                          return (
                              <li key={i} className="char__comics-item">
                                  {item.name}
                              </li>
                          );
                      })
                    : "No comics were found"}
            </ul>
        </>
    );
};

CharInfo.propTypes = {
    charId: propTypes.number,
};

export default CharInfo;
