import FilteringList from '../../../components/adminfiltering/FilteringList';
import FilteringCSS from './AdminFiltering.module.css';

function FilteringListPage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <FilteringList />
            </div>
        </>
    )
}

export default FilteringListPage;