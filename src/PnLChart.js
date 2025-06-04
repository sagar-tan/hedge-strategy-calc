import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

function PnLChart({ data, breakevenPoints, maxLoss, maxGain }) {
  // Find min/max for gradient
  const minPnL = Math.min(...data.map(d => d.pnl));
  const maxPnL = Math.max(...data.map(d => d.pnl));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.7} />
              <stop offset={minPnL < 0 ? `${Math.abs(maxPnL)/(maxPnL-minPnL)*100}%` : '100%'} stopColor="#4ade80" stopOpacity={0.7} />
              <stop offset={minPnL < 0 ? `${Math.abs(maxPnL)/(maxPnL-minPnL)*100}%` : '100%'} stopColor="#f87171" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" label={{ value: 'Stock Price at Expiry', position: 'insideBottomRight', offset: 0 }} type="number" domain={['auto', 'auto']} />
          <YAxis label={{ value: 'P&L', angle: -90, position: 'insideLeft' }} domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="pnl" stroke="#6366f1" fill="url(#pnlGradient)" fillOpacity={1} name="P&L" />
          {breakevenPoints && breakevenPoints.map((bp, idx) => (
            <ReferenceLine key={idx} x={bp} stroke="green" label={`Breakeven ${idx+1}`} />
          ))}
          {maxLoss !== undefined && <ReferenceLine y={maxLoss} stroke="red" label="Max Loss" />}
          {maxGain !== undefined && <ReferenceLine y={maxGain} stroke="blue" label="Max Gain" />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PnLChart; 