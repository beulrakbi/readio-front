import FilteringDetail from "../../../components/adminfiltering/FilteringDetail";
import FilteringCSS from './AdminFiltering.module.css';

function FilteringDetailPage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <FilteringDetail/>
            </div>
        </>

    )
}

export default FilteringDetailPage;