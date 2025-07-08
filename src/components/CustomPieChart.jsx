import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, theme }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill={theme.palette.text.primary} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const generatePieColors = (count, darkMode) => {
    // Use more contrast for dark mode
    const baseColors = darkMode
        ? ['#90caf9', '#f48fb1', '#ffe082', '#80cbc4', '#ce93d8', '#ffab91']
        : ['#326e0a', '#930909', '#ffb300', '#00b894', '#5e60ce', '#fd79a8'];
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
};

const CustomPieChart = ({ data }) => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === 'dark';
    const colors = generatePieColors(data.length, darkMode);
    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart style={{ background: theme.palette.background.paper }}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={props => renderCustomizedLabel({ ...props, theme })}
                    outerRadius={80}
                    fill={theme.palette.primary.main}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CustomPieChart;