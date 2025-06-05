import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminMainCSS from './adminmain.module.css';
import { getInterestDiff } from "../../apis/StatisticsAPICalls";
import InterestCompareChart from "../../pages/admin/statistics/InterestStatistcs/Chart/InterestCompareChart.jsx"

// 날짜 "YYYY-MM" 형식
const getMonthString = (offset = 0) => {
    const now = new Date();
    now.setMonth(now.getMonth() + offset);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
};

function TopInterestsKeyword() {
    const [chartData, setChartData] = useState([]);
    const month1 = getMonthString(-1);
    const month2 = getMonthString(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getInterestDiff({
                    type: "keyword",
                    sort: "diff",
                    limit: 5,
                    month1,
                    month2
                });
                setChartData(response);
            } catch (err) {
                console.error("관심 키워드 비교 차트 불러오기 실패:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={AdminMainCSS.interestsMain}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>유저 등록 관심 키워드 추세</p>
                <Link to="/admin/analytics/interest" className={AdminMainCSS.linkFont}>더보기 &gt;</Link>
            </div>
            <hr className={AdminMainCSS.interestsCsLine} />

            <div className={AdminMainCSS.chartWrapper}>
                {chartData.length > 0 ? (
                    <InterestCompareChart data={chartData} month1={month1} month2={month2} />
                ) : (
                    <p style={{ padding: "20px", textAlign: "center" }}>데이터 없음</p>
                )}
            </div>

            <hr className={AdminMainCSS.interestsCsLine} />
        </div>
    );
}

export default TopInterestsKeyword;
