'use client';

import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';

interface PerformanceChartProps {
    data: any[];
    playerName: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, playerName }) => {
    if (!data || data.length === 0) return null;

    // Normalize data for Radar Chart (0-100 scale ideally)
    const normalizedData = data.map(item => {
        let value = item.value;
        let tourAvg = item.tourAvg;

        // Simple normalization based on known golf stat ranges
        if (item.name === 'Driving Distance') {
            value = (value / 350) * 100;
            tourAvg = (tourAvg / 350) * 100;
        } else if (item.name === 'Putts per GIR') {
            // These are already scaled in backend (*50), let's just use them or re-normalize
            // Actually, let's just pass them as raw percentages for the radar
        }

        return {
            subject: item.name,
            player: item.value,
            avg: item.tourAvg,
            fullMark: 100,
        };
    });

    return (
        <div style={{ width: '100%', height: 400, background: '#fff', borderRadius: '24px', padding: '20px', border: '1px solid #eee' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 700 }}>Performance Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#666', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                    <Radar
                        name={playerName}
                        dataKey="value"
                        stroke="#cc0000"
                        fill="#cc0000"
                        fillOpacity={0.6}
                    />
                    <Radar
                        name="Tour Average"
                        dataKey="tourAvg"
                        stroke="#1a1a1a"
                        fill="#1a1a1a"
                        fillOpacity={0.2}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: any, name: string | undefined) => [value?.toFixed(1) || '0', name || '']}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;
