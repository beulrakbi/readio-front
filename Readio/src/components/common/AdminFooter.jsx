import FooterCSS from './AdminFooter.module.css';

function AdminFooter () {
    return (
        <div className={FooterCSS.adminFooter}>
            <div className={FooterCSS.redBox}/>
            <div className={FooterCSS.footerDiv}>
                <p className={FooterCSS.readio}>READIO</p>
                <p className={FooterCSS.info}>
                    상호 : READIO | 대표자명 : OOO | 개인정보<br/>
                    사업자등록번호 : 000-00-00000 | 이메일 : help@readio.com<br/>
                    주소 : 서울시 종로구 우정국로2길 37 4층
                </p>
                <hr className={FooterCSS.line}/>
                <p className={FooterCSS.info}>Copyright ⓒ READIO</p>
            </div>
        </div>
    )
}

export default AdminFooter;