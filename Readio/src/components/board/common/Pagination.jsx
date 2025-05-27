import styles from "./Pagination.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <div className={styles.pagingbox}>
            {/* 첫 페이지로 이동 */}
            <button
                onClick={() => onPageChange(0)}
                className={styles.num}
                disabled={currentPage === 0}
            >
                &laquo;
            </button>

            {/* 페이지 번호 */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={styles.num}
                    style={{ fontWeight: currentPage === page ? "bold" : "normal" }}
                >
                    {page + 1}
                </button>
            ))}

            {/* 마지막 페이지로 이동 */}
            <button
                onClick={() => onPageChange(totalPages - 1)}
                className={styles.num}
                disabled={currentPage === totalPages - 1}
            >
                &raquo;
            </button>
        </div>
    );
}

export default Pagination;
