import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function InterestCompareChart({ data, month1, month2 }) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart
                data={data}
                margin={{  top: 10, right: 20, left: 20, bottom: 2 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickCount={4} domain={[0, 'dataMax']} tickFormatter={(value) => Number(value)} />
                <Tooltip />
                <Legend />
                <Bar dataKey="countMonth1" fill="#808467" name={month1} />
                <Bar dataKey="countMonth2" fill="#AF4C3F" name={month2} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default InterestCompareChart;
