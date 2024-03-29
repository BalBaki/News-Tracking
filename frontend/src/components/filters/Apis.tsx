import { Field, ErrorMessage } from 'formik';
import { useFetchApisQuery } from '../../store';
import Dropdown from '../Dropdown';
import Loading from '../Loading';
import Error from '../Error';

const Apis: React.FC = () => {
    const { data, isLoading, error } = useFetchApisQuery();

    let content;

    if (isLoading) {
        content = <Loading />;
    } else if (error || data?.error) {
        content = <Error size="xs">Error at Fetching Apis</Error>;
    } else {
        content = data?.apis?.map((api) => {
            return (
                <div key={api.name}>
                    <Field type="checkbox" name="apiList" id={api._id} value={api.value} className="ml-1" />
                    <label className="capitilize pl-2" htmlFor={api._id}>
                        {api.name}
                    </label>
                </div>
            );
        });
    }

    return (
        <div className="w-full max-[340px]:mx-auto">
            <Dropdown placeholder="Select Api">{content}</Dropdown>
            <ErrorMessage name="apiList" component="div" className="text-sm text-red-500" />
        </div>
    );
};

export default Apis;
