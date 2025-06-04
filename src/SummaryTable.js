import React from 'react';

function SummaryTable({ scenarios }) {
  return (
    <table className="summary-table">
      <thead>
        <tr>
          <th>Stock Price vs Spot</th>
          <th>Net Result</th>
          <th>Profit/Loss Source</th>
        </tr>
      </thead>
      <tbody>
        {scenarios.map((row, idx) => (
          <tr key={idx}>
            <td>{row.priceScenario}</td>
            <td>{row.netResult}</td>
            <td>{row.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SummaryTable; 