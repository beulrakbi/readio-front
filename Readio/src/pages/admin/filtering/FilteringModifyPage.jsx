import FilteringModify from "../../../components/adminfiltering/FilteringModify";
import FilteringCSS from './AdminFiltering.module.css';

function FilteringModifyPage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <FilteringModify/>
            </div>
        </>

    )
}

export default FilteringModifyPage;