import { useEffect, useState } from "react";
import { getInterestTrend } from "../../../../apis/StatisticsAPICalls";
import styles from "./InterestStatsPage.module.css";
import InterestTrendChart from "./Chart/InterestTrendChart.jsx";

function InterestTrendPage() {
    const format = (d) => d.toISOString().slice(0, 10);
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const [trendParams, setTrendParams] = useState({
        type: "keyword",
        granularity: "weekly",
        startDate: format(oneWeekAgo),
        endDate: format(today),
        sort: "count",
        limit: "5",
        range: "week"
    });
    const [trendData, setTrendData] = useState([]);

    useEffect(() => {
        fetchTrendData();
    }, [trendParams]);

    const mergeSameLabelData = (data) => {
        const map = new Map();
        data.forEach(({ label, count }) => {
            map.set(label, (map.get(label) || 0) + count);
        });
        return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
    };

    const fetchTrendData = async () => {
        try {
            const { limit, startDate, endDate, ...rest } = trendParams;
            const paramsToSend = {
                ...rest,
                ...(limit !== "" && { limit: Number(limit) }),
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
            };
            const rawData = await getInterestTrend(paramsToSend);
            setTrendData(mergeSameLabelData(rawData));
        } catch (err) {
            console.error("Trend fetch 실패:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTrendParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleDatePreset = (rangeType) => {
        const now = new Date();
        let start = "", end = "";
        if (rangeType === "day") {
            start = end = format(now);
        } else if (rangeType === "week") {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            start = format(weekAgo);
            end = format(now);
        } else if (rangeType === "month") {
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            start = format(monthAgo);
            end = format(now);
        }
        setTrendParams((prev) => ({ ...prev, startDate: start, endDate: end, range: rangeType }));
    };

    return (
            <div className={styles.pageWrapper}>
                <h2 className={styles.heading}>관심 키워드/카테고리 추세</h2>

                <div className={styles.filterWrapper}>
                    <div className={styles.leftFilters}>
                        {/* 조건검색 */}
                        <div className={styles.filterGroup}>
                            <span className={styles.groupLabel}>조건검색</span>
                            <div className={styles.inlineOptions}>
                                <label>
                                    <input type="radio" name="type" value="category"
                                           checked={trendParams.type === "category"} onChange={handleInputChange}/>
                                    관심분야
                                </label>
                                <label>
                                    <input type="radio" name="type" value="keyword"
                                           checked={trendParams.type === "keyword"} onChange={handleInputChange}/>
                                    관심 키워드
                                </label>
                            </div>
                        </div>

                        {/* 결과 개수 */}
                        <div className={styles.filterGroup}>
                            <span className={styles.groupLabel}>결과 개수</span>
                            <div className={styles.inlineOptions}>
                                <label>
                                    <input type="radio" name="limit" value="" checked={trendParams.limit === ""}
                                           onChange={handleInputChange}/>
                                    전체
                                </label>
                                <label>
                                    <input type="radio" name="limit" value="3" checked={trendParams.limit === "3"}
                                           onChange={handleInputChange}/>
                                    3개
                                </label>
                                <label>
                                    <input type="radio" name="limit" value="5" checked={trendParams.limit === "5"}
                                           onChange={handleInputChange}/>
                                    5개
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.rightFilters}>
                        {/* 기간(당일 기준) */}
                        <div className={styles.filterGroup}>
                            <span className={styles.groupLabel}>기간(당일 기준)</span>
                            <label>
                                <input type="radio" name="range" checked={trendParams.range === "all"}
                                       onChange={() => handleDatePreset("all")}/>
                                전체
                            </label>
                            <label>
                                <input type="radio" name="range" checked={trendParams.range === "week"}
                                       onChange={() => handleDatePreset("week")}/>
                                일주일
                            </label>
                            <label>
                                <input type="radio" name="range" checked={trendParams.range === "month"}
                                       onChange={() => handleDatePreset("month")}/>
                                한 달
                            </label>
                        </div>

                        {/* 날짜 수동 선택 */}
                        <div className={styles.filterGroup}>
                            <span className={styles.groupLabel}>기간</span>
                            <input type="date" name="startDate" value={trendParams.startDate || ""}
                                   onChange={handleInputChange}/>
                            ~
                            <input type="date" name="endDate" value={trendParams.endDate} onChange={handleInputChange}/>
                        </div>
                    </div>
                </div>


            <div className={styles.chartContainer}>
                <InterestTrendChart data={trendData} />
            </div>
        </div>
    );
}

export default InterestTrendPage;
