import FilteringCSS from '../filtering/AdminFiltering.module.css';
import CurationManager from "../../../components/adminkeyword/CurationManager.jsx";

function CurationManagerPage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <CurationManager/>
            </div>
        </>

    )
}

export default CurationManagerPage;