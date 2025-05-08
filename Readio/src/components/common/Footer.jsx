import FooterCSS from './Footer.module.css'

function Footer () {
    return (
        <div className={FooterCSS.footerDiv}>
            <h1 style={{color: 'rgb(97,97,97)',fontWeight: '900'}}>READIO</h1>
            <p>
                상호 : READIO | 대표자명 : OOO | 개인정보<br/>
                사업자등록번호 : 000-00-00000 | 이메일 : help@readio.com<br/>
                주소 : 서울시 종로구 우정국로2길 37 4층
            </p>
            <hr style={{width: '30%', textAlign: 'left', marginLeft: '0'}}/>
            <h3>Copyright ⓒ READIO</h3>
        </div>
    )
}

export default Footer;