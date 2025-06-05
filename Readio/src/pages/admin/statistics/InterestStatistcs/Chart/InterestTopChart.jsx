import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

function InterestTopChart({ title, data }) {
    return (
        <div style={{ flex: 1 }}>
            <h3 style={{ marginLeft: "1rem" }}>{title}</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* Y축 = label */}
                    <YAxis
                        dataKey="label"
                        type="category"
                        tick={{ fontSize: 14 }}
                        width={100} // label 길이 확보
                    />

                    {/* X축 = count */}
                    <XAxis
                        type="number"
                        domain={[0, 'dataMax']}
                        tick={{ fontSize: 12 }}
                        tickCount={4}
                    />

                    <Tooltip
                        formatter={(value) => [`${value}`, "사용 횟수"]}
                        labelFormatter={(label) => `${label}`}
                    />

                    <Bar
                        dataKey="count"
                        fill="#808467"
                        name="사용 횟수"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default InterestTopChart;
