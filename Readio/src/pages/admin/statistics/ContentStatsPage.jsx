import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ContentStatsPage.module.css";
import { getClickAnalytics } from "../../../apis/StatisticsAPICalls";

function ContentStatsPage() {
    const [searchParams] = useSearchParams();
    const [resultList, setResultList] = useState([]);

    const [filters, setFilters] = useState({
        type: searchParams.get("type") || "",   // ✅ type = 'video'
        sort: "click",
        limit: 10
    });

    useEffect(() => {
        const fetchData = async () => {
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            const format = d => d.toISOString().slice(0, 10);

            try {
                const data = await getClickAnalytics({
                    ...filters,
                    startDate: format(oneWeekAgo),
                    endDate: format(today)
                });
                setResultList(data);
            } catch (e) {
                console.error("데이터 불러오기 실패:", e);
            }
        };

        if (filters.type) fetchData();
    }, [filters]);

    return (
        <div className={styles.pageWrapper}>
            <h2>콘텐츠 통계 (상세)</h2>

            <div className={styles.filterBox}>
                <label>
                    <input
                        type="checkbox"
                        checked={filters.type === "video"}
                        onChange={() =>
                            setFilters(prev => ({
                                ...prev,
                                type: prev.type === "video" ? "" : "video"
                            }))
                        }
                    />
                    영상
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={filters.type === "book"}
                        onChange={() =>
                            setFilters(prev => ({
                                ...prev,
                                type: prev.type === "book" ? "" : "book"
                            }))
                        }
                    />
                    책
                </label>
            </div>

            <table className={styles.statsTable}>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>클릭수</th>
                    <th>{filters.type === "video" ? "영상 제목" : "책 제목"}</th>
                    <th>상세 페이지</th>
                </tr>
                </thead>
                <tbody>
                {resultList.map((item, idx) => (
                    <tr key={item.contentId}>
                        <td>{idx + 1}</td>
                        <td>{item.clickCount}</td>
                        <td>{item.title}</td>
                        <td>
                            <a
                                href={`http://localhost:5173/${filters.type}/${item.contentId}`}
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
        </div>
    );
}

export default ContentStatsPage;
