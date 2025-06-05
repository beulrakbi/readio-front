import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
import styles from "./ContentStatsPage.module.css";
import { getClickAnalytics, getBookmarkAnalytics } from "../../../../apis/StatisticsAPICalls.js";

function ContentStatsPage() {

    const [resultList, setResultList] = useState([]);
    // const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    const format = (d) => d.toISOString().slice(0, 10);

    const [filters, setFilters] = useState({
        type: ["video"],
        sort: "click",
        limit: "10",
        startDate: format(oneWeekAgo),
        endDate: format(today),
        range: "week"
    });
    const isBookmarkSort = filters.sort === "bookmark";

// 페이지당 고정 단위
    const paginationUnit = 10;

// 실제 보여줄 개수는 filters.limit 기준
    const displayLimit = filters.limit === "" ? resultList.length : Number(filters.limit);
    const displayList = resultList.slice(0, displayLimit);

// 페이지 수는 항상 10개 단위로 계산
    const totalPages = Math.ceil(displayList.length / paginationUnit);
// 현재 페이지에서 보여줄 데이터 범위 계산
    const startIdx = (currentPage - 1) * paginationUnit;
    const endIdx = Math.min(startIdx + paginationUnit, displayList.length);

    const visibleList = displayList.slice(startIdx, endIdx);
    useEffect(() => {
        // console.log("응답 데이터:", resultList.length, totalCount);
    }, [resultList]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters.type, filters.sort, filters.startDate, filters.endDate, filters.limit]);

    useEffect(() => {
        fetchData();
        console.log("현재 필터 상태:", filters);
    }, [filters, currentPage]);

    const fetchData = async () => {
        try {
            const params = {
                ...filters,
                page: 0,
                limit: 1000,  // 항상 전체 받아오기
                type: filters.type[0],
            };

            console.log("보내는 파라미터:", params);

            if (filters.sort === "click" && filters.startDate && filters.endDate) {
                params.startDate = filters.startDate;
                params.endDate = filters.endDate;
            } else {
                delete params.startDate;
                delete params.endDate;
            }

            const data = filters.sort === "bookmark"
                ? await getBookmarkAnalytics(params)
                : await getClickAnalytics(params);

            setResultList((data.list || []).sort((a, b) => {
                return filters.sort === "bookmark"
                    ? (b.bookmarkCount ?? b.count) - (a.bookmarkCount ?? a.count)
                    : b.clickCount - a.clickCount;
            }));

        } catch (e) {
            console.error("데이터 불러오기 실패:", e);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFilters((prev) => {
            const updated = { ...prev };

            if (name === "type") {
                updated.type = [value]; // 무조건 하나만 선택되도록
            } else if (type === "checkbox") {
                // checkbox: 클릭 or 북마크 등 단일 값 선택
                updated[name] = checked ? value : "";
            } else {
                // radio, date 등 기본 처리
                updated[name] = value;
            }

            // 정렬 기준이 bookmark일 경우 기간 초기화
            if (name === "sort") {
                if (value === "bookmark") {
                    updated.startDate = "";
                    updated.endDate = "";
                    updated.range = "all";
                } else if (value === "click" && (!prev.startDate || !prev.endDate)) {
                    const today = new Date();
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(today.getDate() - 7);
                    updated.startDate = format(oneWeekAgo);
                    updated.endDate = format(today);
                    updated.range = "week";
                }
            }

            return updated;
        });
    };

    const handleSearch = () => {
        console.log("검색 직전 필터:", filters);
        setCurrentPage(1);
        fetchData();
    };

    return (
        <div className={styles.pageWrapper}>
            <h2 className={styles.heading}>콘텐츠 통계</h2>

            <div className={styles.filterWrapper}>
                <div className={styles.leftFilters}>
                    <div className={styles.filterGroup}>
                        <span className={styles.groupLabel}>조건검색</span>
                        <div className={styles.inlineOptions}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="type"
                                    value="video"
                                    checked={filters.type.includes("video")}
                                    onChange={handleInputChange}
                                />영상
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="type"
                                    value="book"
                                    checked={filters.type.includes("book")}
                                    onChange={handleInputChange}
                                />책
                            </label>
                            {/*<label>*/}
                            {/*    <input*/}
                            {/*        type="checkbox"*/}
                            {/*        name="type"*/}
                            {/*        value="interest"*/}
                            {/*        checked={filters.type.includes("interest")}*/}
                            {/*        onChange={handleInputChange}*/}
                            {/*    />관심분야*/}
                            {/*</label>*/}

                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <span className={styles.groupLabel}>정렬기준</span>
                        <div className={styles.inlineOptions}>
                            <label><input type="checkbox" name="sort" value="click" checked={filters.sort === "click"} onChange={handleInputChange} /> 클릭</label>
                            <label><input type="checkbox" name="sort" value="bookmark" checked={filters.sort === "bookmark"} onChange={handleInputChange} /> 북마크</label>
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <span className={styles.groupLabel}>결과 개수</span>
                        <div className={styles.inlineOptions}>
                            <label><input type="radio" name="limit" value="" checked={filters.limit === ""} onChange={handleInputChange} /> 전체</label>
                            <label><input type="radio" name="limit" value="10" checked={filters.limit === "10"} onChange={handleInputChange} /> 10개</label>
                            <label><input type="radio" name="limit" value="20" checked={filters.limit === "20"} onChange={handleInputChange} /> 20개</label>
                            <label><input type="radio" name="limit" value="30" checked={filters.limit === "30"} onChange={handleInputChange} /> 30개</label>
                        </div>
                    </div>
                </div>

                <div className={styles.centerButtonWrapper}>
                    <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
                </div>

                <div className={styles.rightFilters}>
                    <div className={styles.filterGroup}>
                        <span className={styles.groupLabel}>기간(당일 기준)</span>

                        <label>
                            <input
                                type="radio"
                                name="range"
                                checked={filters.range === "all"}
                                disabled={false} // 전체는 항상 선택 가능
                                onChange={() => {
                                    setFilters(prev => ({
                                        ...prev,
                                        startDate: "",
                                        endDate: "",
                                        range: "all"
                                    }));
                                }}
                            />
                            전체
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="range"
                                checked={filters.range === "day"}
                                disabled={isBookmarkSort} // 북마크일 경우 비활성화
                                onChange={() => {
                                    const d = new Date();
                                    setFilters(prev => ({
                                        ...prev,
                                        startDate: format(d),
                                        endDate: format(d),
                                        range: "day"
                                    }));
                                }}
                            />
                            당일
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="range"
                                checked={filters.range === "week"}
                                disabled={isBookmarkSort}
                                onChange={() => {
                                    const d = new Date();
                                    d.setDate(today.getDate() - 7);
                                    setFilters(prev => ({
                                        ...prev,
                                        startDate: format(d),
                                        endDate: format(today),
                                        range: "week"
                                    }));
                                }}
                            />
                            일주일
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="range"
                                checked={filters.range === "month"}
                                disabled={isBookmarkSort}
                                onChange={() => {
                                    const d = new Date();
                                    d.setMonth(today.getMonth() - 1);
                                    setFilters(prev => ({
                                        ...prev,
                                        startDate: format(d),
                                        endDate: format(today),
                                        range: "month"
                                    }));
                                }}
                            />
                            한 달
                        </label>
                    </div>

                    <div className={styles.filterGroup}>
                        <span className={styles.groupLabel}>기간</span>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} />
                        ~
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            <table className={styles.statsTable}>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>{filters.sort === "bookmark" ? "북마크수" : "클릭수"}</th>
                    <th>{filters.type[0] === "video" ? "영상 제목" : "책 제목"}</th>
                    <th>상세 페이지</th>
                </tr>
                </thead>
                <tbody>
                {visibleList.map((item, idx) => (
                    <tr key={item.contentId}>
                        <td>{startIdx + idx + 1}</td>
                        <td>{filters.sort === "bookmark" ? (item.bookmarkCount ?? item.count) : item.clickCount}</td>
                        <td>{item.title}</td>
                        <td>
                            <a
                                href={`http://localhost:5173/${
                                    filters.type[0] === "book"
                                        ? `bookPage/${item.contentId}`
                                        : `video/${item.contentId}`
                                }`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                열기
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {(filters.limit === "" || Number(filters.limit) > paginationUnit) && totalPages > 1 && (
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={currentPage === i + 1 ? styles.activePage : ""}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
}

export default ContentStatsPage;
