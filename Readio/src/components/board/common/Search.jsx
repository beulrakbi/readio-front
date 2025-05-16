import searchIcon from "../../../assets/search2.png";
import styles from "./search.module.css";
function Search() {
    return(
        <>
            <div className={styles.textcontainer}>
                <input className={styles.textbox} type="text" placeholder="검색어를 입력해주세요." />
                <button className={styles.btn}><img src={searchIcon}/></button>
            </div>
        </>
    )
}

export default Search;