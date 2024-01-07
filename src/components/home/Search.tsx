import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useSearchMutation, type RootState } from '../../store';
import { type FilterSettings } from '../../types';
import Apis from '../form/Apis';
import Button from '../Button';
import Filters from '../form/Filters';
import { SEARCH_MUTATION_CACHE_KEY } from './NewsList';

const Search: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const [search, searchResult] = useSearchMutation({ fixedCacheKey: SEARCH_MUTATION_CACHE_KEY });
    const initialValues: FilterSettings = {
        term: '',
        fromDate: user.filterSettings.fromDate || '',
        toDate: user.filterSettings.toDate || new Date().toISOString().split('T')[0],
        apiNames: user.filterSettings.apiNames.length > 0 ? user.filterSettings.apiNames : [],
        extraFilters: {},
    };

    const formSchema = Yup.object().shape({
        term: Yup.string()
            .required('Term required')
            .max(100, ({ max }) => `Maximum ${max} character`),
        apiNames: Yup.mixed<string[]>().test(
            'api-required',
            'Select Minimum 1 Api',
            (value) => value && value.length > 0
        ),
    });

    return (
        <div className="mt-4">
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={(values) => {
                    if (values.extraFilters.theguardians.section === 'all')
                        values.extraFilters.theguardians.section = '';

                    search({
                        ...values,
                        term: values.term.toLocaleLowerCase(),
                    });
                }}
            >
                {({ values, isValid, dirty }) => (
                    <>
                        <Form>
                            <div className="min-[400px]:w-5/6 min-[400px]:mx-auto mx-3">
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 justify-items-center mt-2">
                                    <div className="w-full">
                                        <Field
                                            type="text"
                                            name="term"
                                            id="term"
                                            placeholder="Search Term"
                                            className="w-full border-2 px-1"
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                e.key === 'Enter' && e.preventDefault();
                                            }}
                                        />
                                        <ErrorMessage
                                            name="term"
                                            component="div"
                                            className="text-sm  text-red-500 h-6"
                                        />
                                    </div>
                                    <div className="flex justify-around xl:justify-evenly w-full max-[350px]:block">
                                        <div className="flex items-start">
                                            <div className="max-[350px]:w-12 max-[350px]:mr-0 mr-3">
                                                <label htmlFor="fromDate">From: </label>
                                            </div>
                                            <Field
                                                type="date"
                                                name="fromDate"
                                                id="fromDate"
                                                className="border-2 px-1"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div className="flex items-start min-[351px]:ml-2 max-[350px]:mt-2">
                                            <div className="max-[350px]:w-12 mr-3 max-[350px]:mr-0">
                                                <label htmlFor="toDate">To: </label>
                                            </div>
                                            <Field
                                                type="date"
                                                name="toDate"
                                                id="toDate"
                                                className="border-2 px-1"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>
                                    <Apis />
                                    <Filters />
                                    <Filters />
                                    <Filters />
                                </div>
                                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"></div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center max-[300px]:block max-[300px]:text-center mt-2">
                                <Button
                                    type="submit"
                                    className={`w-36 h-7 rounded-md text-white disabled:cursor-not-allowed ${
                                        isValid && dirty ? 'bg-green-400' : 'bg-red-500'
                                    }`}
                                    disabled={searchResult.isLoading || !(isValid && dirty)}
                                    loading={searchResult.isLoading}
                                >
                                    Search
                                </Button>
                                {/* {user?.id && <SaveSettings settings={values} />} */}
                            </div>
                        </Form>
                    </>
                )}
            </Formik>
        </div>
    );
};

export default Search;