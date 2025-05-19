import FilteringCreate from "../../../components/adminfiltering/FIlteringCreate";
import FilteringCSS from './AdminFiltering.module.css';

function FilteringCreatePage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <FilteringCreate/>
            </div>
        </>

    )
}

export default FilteringCreatePage;