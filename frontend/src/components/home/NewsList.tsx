import { useEffect } from 'react';
import './NewsList.css';
import { Pagination, type CustomFlowbiteTheme } from 'flowbite-react';
import { useFormikContext } from 'formik';
import { useLocation } from 'react-router-dom';
import { useSearchMutation, useFetchApisQuery } from '../../store';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

import { type FilterSettings } from '../../types';
import NewsItem from './NewsItem';
import Loading from '../Loading';
import {
    SEARCH_MUTATION_CACHE_KEY,
    NEWS_API_NAME,
    THE_GUARDIANS_API_NAME,
    THE_NEW_YORK_TIMES,
} from '../../utils/constants';
import GoPageWithNum from './GoPageWithNum';
import NewsListPart from './NewsListPart';

// const ITEMS_PER_API = 10;
const customPaginationTheme: CustomFlowbiteTheme['pagination'] = {
    base: '',
    layout: {
        table: {
            base: 'text-sm text-gray-700 dark:text-gray-400',
            span: 'font-semibold text-gray-900 dark:text-white',
        },
    },
    pages: {
        base: 'xs:mt-0 mt-2 inline-flex items-center -space-x-px',
        showIcon: 'inline-flex',
        previous: {
            base: 'ml-0 rounded-l-lg border-2 border-[#6B7280] bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-200 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white max-[360px]:w-9',
            icon: 'h-5 w-5',
        },
        next: {
            base: 'rounded-r-lg border-2 border-[#6B7280] bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-200 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white max-[360px]:w-9',
            icon: 'h-5 w-5',
        },
        selector: {
            base: 'w-12 border-2 border-[#6B7280] bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-gray-200 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white max-[360px]:w-9',
            active: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white',
            disabled: 'opacity-50 cursor-normal',
        },
    },
};
// const articleColors = {
//     [NEWS_API_NAME]: {
//         imageFilterBg: 'bg-[rgba(255,111,97,0.4)]',
//     },
//     [THE_GUARDIANS_API_NAME]: {
//         imageFilterBg: 'bg-[rgba(102,103,171,0.4)]',
//     },
//     [THE_NEW_YORK_TIMES]: {
//         imageFilterBg: 'bg-[rgba(69,181,170,0.4)]',
//     },
// };

const NewsList: React.FC = () => {
    const [search, { data, error, isLoading, reset }] = useSearchMutation({
        fixedCacheKey: SEARCH_MUTATION_CACHE_KEY,
    });
    // const { data: apiData } = useFetchApisQuery();
    // const { values, isValid } = useFormikContext<FilterSettings>();
    const location = useLocation();
    // const maxPage = Math.ceil((data?.maxNewsCount || 0) / ITEMS_PER_API);

    // const onPageChange = (page: number): void => {
    //     if (!isValid || page === data?.page) return;

    //     search({ ...values, page });
    // };

    // useEffect(() => {
    //     reset();
    // }, [location]);

    if (isLoading)
        return (
            <div className="h-64">
                <Loading />
            </div>
        );
    if (error || data?.error) return <div className="ml-3">Error At Fetching News</div>;

    let renderedNews;

    if (data?.articles) {
        renderedNews = Object.keys(data.articles).map((apiName) => {
            return <NewsListPart apiName={apiName} key={apiName} />;
            // const renderedArticles = data.articles[apiName].map((article) => {
            //     return <NewsItem key={article.id} news={article} colors={articleColors[apiName]} />;
            // });

            // return (
            //     <div key={apiName}>
            //         <div
            //             className={`flex justify-between capitalize text-2xl italic mt-8 ${articleColors[apiName].imageFilterBg} rounded-2xl px-3 py-1`}
            //         >
            //             {apiData?.apis?.find((api) => api.value === apiName)?.name || apiName}
            //             <div className="flex items-center">
            //                 <MdOutlineKeyboardArrowLeft className="cursor-pointer" />
            //                 <MdOutlineKeyboardArrowRight className="cursor-pointer" />
            //             </div>
            //         </div>
            //         <div className="flex flex-wrap justify-center sm:justify-evenly gap-3 mt-4">
            //             {renderedArticles}
            //         </div>
            //     </div>
            // );
        });
    }

    return (
        <section className="mt-6 mx-3" aria-label="news">
            {data?.search ? (
                Object.keys(data.articles).length > 0 ? (
                    <>
                        {renderedNews}
                        {/* {data.maxNewsCount > ITEMS_PER_API && (
                            <div className="text-center mb-[5rem] sm:mb-4 mt-2">
                                <Pagination
                                    theme={customPaginationTheme}
                                    currentPage={data.page}
                                    totalPages={maxPage}
                                    onPageChange={onPageChange}
                                    previousLabel=""
                                    nextLabel=""
                                    showIcons
                                />
                                <GoPageWithNum maxPage={maxPage} />
                            </div>
                        )} */}
                    </>
                ) : (
                    <div className="ml-3">No News Found</div>
                )
            ) : (
                ''
            )}
        </section>
    );
};

export default NewsList;
