import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChangeFavoriteMutation, type RootState } from '../../store';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { type News } from '../../types';

type NewsProps = {
    news: News;
    colors?: { [key: string]: string };
};

const NewsItem: React.FC<NewsProps> = ({ news, colors }) => {
    const { url, imageUrl, title, description } = news;
    const { id, favorites } = useSelector((state: RootState) => state.user);
    const [isFavorite, setIsFavorite] = useState(
        favorites?.find((favoriteNews) => favoriteNews.url === news.url) ? true : false
    );
    const [changeFavorite, { data }] = useChangeFavoriteMutation();
    const randomNumber = useMemo(() => Math.random(), []);
    const BookMark = isFavorite ? FaBookmark : FaRegBookmark;

    useEffect(() => {
        if (data?.success) setIsFavorite((c) => !c);
    }, [data]);

    const handleChangeFavoritesClick = () => {
        changeFavorite({ type: isFavorite ? 'remove' : 'add', news });
    };

    const renderedParts = [
        <div className="flex flex-row-reverse relative rounded-xl" key="firstPart">
            <div className="w-[60%] h-36 m-2 rounded-full border-2 overflow-hidden relative">
                <img src={imageUrl} alt={title} className="w-full h-full" loading="lazy" />
                <div className={`absolute inset-0 ${colors?.imageFilterBg}`}></div>
            </div>
        </div>,
        <div className="border-b-3 text-md px-4 mt-2" key="secondPart">
            <div className="line-clamp-4 top-5 font-bold text-xl uppercase w-full h-28" title={title}>
                {title}
            </div>
            <div className="h-24 line-clamp-[6] text-sm leading-4 my-3" title={description}>
                {description}
            </div>
        </div>,
    ];

    if (randomNumber > 0.5) [renderedParts[0], renderedParts[1]] = [renderedParts[1], renderedParts[0]];

    return (
        <article className="relative border-2 rounded-2xl border-black bg-white w-[16.6rem] max-[300px]:w-full group">
            <a href={url} target="_blank" rel="noreferrer">
                <div className="h-full w-full p-2">{renderedParts}</div>
            </a>
            {id && (
                <div
                    className={`absolute w-9 h-9 ${colors?.bookMarkIconBg || 'bg-red-400'} rounded-full p-2 z-10 ${
                        randomNumber > 0.5 ? 'left-[35%] bottom-5' : 'top-4 right-4'
                    } opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                    <BookMark
                        className="w-full h-full cursor-pointer text-black"
                        onClick={handleChangeFavoritesClick}
                    />
                </div>
            )}
        </article>
    );
};

export default NewsItem;
