import styles from "./Pagination.module.css";
function Pagination(){
    return(
        <>
        <div className={styles.pagingbox}>
            <p className={styles.num}>1 2 3 4 5</p>
        </div>
        </>
    )
}
export default Pagination;