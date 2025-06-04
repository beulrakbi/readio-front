import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function InterestTrendChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 2 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickCount={4} domain={[0, 'dataMax']} tickFormatter={(value) => Number(value)} />
                <Tooltip />
                <Bar dataKey="count" fill="#808467" name="사용 횟수" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default InterestTrendChart;
