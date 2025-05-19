
import AdminMainCSS from './adminmain.module.css';

function TopInterestsKeyword()
{
    return (
        <div className={AdminMainCSS.interestsMain}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>유저 등록 관심 키워드 추세</p>
            </div>
            <hr className={AdminMainCSS.interestsCsLine}/>

            <hr className={AdminMainCSS.interestsCsLine}/>
        </div>
    )
}

export default TopInterestsKeyword;