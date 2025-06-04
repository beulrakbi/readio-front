import { useEffect, useState } from "react";
import { getInterestDiff } from "../../../../apis/StatisticsAPICalls";
import styles from "./InterestStatsPage.module.css";
import InterestCompareChart from "./Chart/InterestCompareChart.jsx";
import InterestTopChart from "./Chart/InterestTopChart.jsx";

// 날짜를 "YYYY-MM" 형태로 반환
const getMonthString = (offset = 0) => {
    const now = new Date();
    now.setMonth(now.getMonth() + offset); // offset=0: 이번 달, -1: 전달
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
};

function InterestComparePage() {
    const [compareParams, setCompareParams] = useState({
        type: "keyword",
        sort: "diff",
        limit: "5",
        month1: getMonthString(-1),  // 전달
        month2: getMonthString(0),   // 이번 달
    });

    const [compareData, setCompareData] = useState([]);

    useEffect(() => {
        fetchCompareData();
    }, [compareParams]);

    const fetchCompareData = async () => {
        try {
            const { limit, ...rest } = compareParams;
            const paramsToSend = {
                ...rest,
                ...(limit !== "" && { limit: Number(limit) }),
            };
            const data = await getInterestDiff(paramsToSend);
            setCompareData(data);
        } catch (err) {
            console.error("Compare fetch 실패:", err);
        }
    };

    const handleCompareInputChange = (e) => {
        const { name, value } = e.target;
        setCompareParams((prev) => ({ ...prev, [name]: value }));
    };

    const topMonth1 = [...compareData]
        .filter(item => item.countMonth1 > 0)
        .map(item => ({ label: item.label, count: item.countMonth1 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, Number(compareParams.limit));

    const topMonth2 = [...compareData]
        .filter(item => item.countMonth2 > 0)
        .map(item => ({ label: item.label, count: item.countMonth2 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, Number(compareParams.limit));

    return (
        <div className={styles.pageWrapper2}>
            <h2 className={styles.heading}>관심 키워드/카테고리 추세비교</h2>

            <div className={styles.filterWrapper}>
                <div className={styles.leftFilters}>
                    <div className={styles.filterGroup}>
                        <span className={styles.groupLabel}>조건검색</span>
                        <div className={styles.inlineOptions}>
                            <label>
                                <input type="radio" name="type" value="category"
                                       checked={compareParams.type === "category"} onChange={handleCompareInputChange} />
                                관심분야
                            </label>
                            <label>
                                <input type="radio" name="type" value="keyword"
                                       checked={compareParams.type === "keyword"} onChange={handleCompareInputChange} />
                                관심 키워드
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.rightFilters}>
                    <div className={styles.filterGroup}>
                        <span className={styles.groupLabel}>결과 개수</span>
                        <div className={styles.inlineOptions}>
                            <label>
                                <input type="radio" name="limit" value=""
                                       checked={compareParams.limit === ""} onChange={handleCompareInputChange} />
                                전체
                            </label>
                            <label>
                                <input type="radio" name="limit" value="3"
                                       checked={compareParams.limit === "3"} onChange={handleCompareInputChange} />
                                3개
                            </label>
                            <label>
                                <input type="radio" name="limit" value="5"
                                       checked={compareParams.limit === "5"} onChange={handleCompareInputChange} />
                                5개
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.chartContainer2}>
                {compareParams.limit === "" ? (
                    <InterestCompareChart
                        data={compareData}
                        month1={compareParams.month1}
                        month2={compareParams.month2}
                    />
                ) : (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <InterestTopChart
                            title={`${compareParams.month1} 관심 Top ${compareParams.limit}`}
                            data={topMonth1}
                            layout="vertical"
                        />
                        <InterestTopChart
                            title={`${compareParams.month2} 관심 Top ${compareParams.limit}`}
                            data={topMonth2}
                            layout="vertical"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default InterestComparePage;
