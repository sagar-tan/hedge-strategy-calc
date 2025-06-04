import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Line, Brush } from 'recharts';

function PnLChart({ data, breakevenPoints, maxLoss, maxGain, spotPrice }) {
  const [xDomain, setXDomain] = useState(['auto', 'auto']);
  const [yDomain, setYDomain] = useState(['auto', 'auto']);

  // Find min/max for gradient
  const minPnL = Math.min(...data.map(d => d.pnl));
  const maxPnL = Math.max(...data.map(d => d.pnl));
  // Calculate the offset for the zero line (breakeven)
  const zeroOffset = maxPnL === minPnL ? 0.5 : (maxPnL / (maxPnL - minPnL));

  // Calculate spot PnL line if not present in data
  const spotPnLData = data.map(d => ({ price: d.price, spotPnL: d.price - spotPrice }));

  const handleXZoom = (direction) => {
    const [min, max] = xDomain;
    const range = max - min;
    const zoomFactor = 0.2;
    
    if (direction === 'in') {
      setXDomain([min + range * zoomFactor, max - range * zoomFactor]);
    } else {
      setXDomain([min - range * zoomFactor, max + range * zoomFactor]);
    }
  };

  const handleYZoom = (direction) => {
    const [min, max] = yDomain;
    const range = max - min;
    const zoomFactor = 0.2;
    
    if (direction === 'in') {
      setYDomain([min + range * zoomFactor, max - range * zoomFactor]);
    } else {
      setYDomain([min - range * zoomFactor, max + range * zoomFactor]);
    }
  };

  const resetZoom = () => {
    setXDomain(['auto', 'auto']);
    setYDomain(['auto', 'auto']);
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            onClick={() => handleXZoom('in')}
            style={{
              padding: '4px 8px',
              background: '#1f2937',
              border: '1px solid #4b5563',
              color: '#e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            X+
          </button>
          <button 
            onClick={() => handleXZoom('out')}
            style={{
              padding: '4px 8px',
              background: '#1f2937',
              border: '1px solid #4b5563',
              color: '#e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            X-
          </button>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            onClick={() => handleYZoom('in')}
            style={{
              padding: '4px 8px',
              background: '#1f2937',
              border: '1px solid #4b5563',
              color: '#e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Y+
          </button>
          <button 
            onClick={() => handleYZoom('out')}
            style={{
              padding: '4px 8px',
              background: '#1f2937',
              border: '1px solid #4b5563',
              color: '#e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Y-
          </button>
        </div>
        <button 
          onClick={resetZoom}
          style={{
            padding: '4px 8px',
            background: '#1f2937',
            border: '1px solid #4b5563',
            color: '#e5e7eb',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
      <ResponsiveContainer>
        <AreaChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              {/* Profit area: light green to dark green, Loss area: light red to dark red */}
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
              <stop offset={`${zeroOffset * 100}%`} stopColor="#15803d" stopOpacity={0.9} />
              <stop offset={`${zeroOffset * 100}%`} stopColor="#ef4444" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#991b1b" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="price" 
            label={{ value: 'Stock Price at Expiry', position: 'insideBottomRight', offset: 0, fill: '#e5e7eb' }} 
            type="number" 
            domain={xDomain}
            tick={{ fill: '#e5e7eb' }} 
            allowDataOverflow={true}
          />
          <YAxis 
            label={{ value: 'P&L', angle: -90, position: 'insideLeft', fill: '#e5e7eb' }} 
            domain={yDomain}
            tick={{ fill: '#e5e7eb' }} 
            allowDataOverflow={true}
          />
          <Tooltip 
            contentStyle={{ 
              background: '#1f2937', 
              border: '1px solid #4b5563', 
              color: '#e5e7eb',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} 
            labelStyle={{ color: '#e5e7eb' }} 
          />
          <Legend 
            iconType="plainline" 
            wrapperStyle={{ color: '#e5e7eb' }} 
          />
          <Area 
            type="monotone" 
            dataKey="pnl" 
            stroke="#e5e7eb" 
            fill="url(#pnlGradient)" 
            fillOpacity={1} 
            name="Strategy P&L" 
            strokeWidth={2} 
          />
          {/* Spot price P&L line */}
          <Line 
            type="monotone" 
            dataKey="spotPnL" 
            data={spotPnLData} 
            stroke="#60a5fa" 
            strokeWidth={2} 
            dot={false} 
            name="Spot Price P&L" 
            strokeDasharray="6 3" 
          />
          {/* Breakeven lines */}
          {breakevenPoints && breakevenPoints.map((bp, idx) => (
            <ReferenceLine 
              key={idx} 
              x={bp} 
              stroke="#e5e7eb" 
              strokeDasharray="4 4" 
              label={{ 
                value: `Breakeven ${idx+1}`, 
                fill: '#e5e7eb', 
                fontSize: 12,
                background: '#1f2937',
                padding: '2px 4px',
                borderRadius: '2px'
              }} 
            />
          ))}
          {/* Max loss/gain lines */}
          {maxLoss !== undefined && (
            <ReferenceLine 
              y={maxLoss} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Max Loss', 
                fill: '#ef4444', 
                fontSize: 12,
                background: '#1f2937',
                padding: '2px 4px',
                borderRadius: '2px'
              }} 
            />
          )}
          {maxGain !== undefined && (
            <ReferenceLine 
              y={maxGain} 
              stroke="#22c55e" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Max Gain', 
                fill: '#22c55e', 
                fontSize: 12,
                background: '#1f2937',
                padding: '2px 4px',
                borderRadius: '2px'
              }} 
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PnLChart; 