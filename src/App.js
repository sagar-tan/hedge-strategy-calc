import React, { useState, useMemo } from 'react';
import './App.css';
import InputForm from './InputForm';
import SummaryTable from './SummaryTable';
import PnLChart from './PnLChart';
import { Container, Row, Col, Card } from 'react-bootstrap';

const defaultValues = {
  spotPrice: 100,
  expectedMove: 5,
  putStrike: 95,
  callStrike: 105,
  putPremium: 2,
  callPremium: 2,
  positionSize: 1,
};

function calculatePnL({ spotPrice, putStrike, callStrike, putPremium, callPremium, positionSize }) {
  // Generate a range of expiry prices for the chart
  const minPrice = Math.max(0, spotPrice * 0.7);
  const maxPrice = spotPrice * 1.3;
  const step = (maxPrice - minPrice) / 100;
  let data = [];
  let longLeg = [];
  let shortLeg = [];
  let breakevens = [];
  let maxLoss = null;
  let maxGain = null;

  for (let P = minPrice; P <= maxPrice; P += step) {
    // Long Stock + Put
    const longStockPnL = (P - spotPrice) * positionSize;
    const putPnL = (Math.max(0, putStrike - P) - putPremium) * positionSize;
    const longLegPnL = longStockPnL + putPnL;
    // Short Stock + Call
    const shortStockPnL = (spotPrice - P) * positionSize;
    const callPnL = (Math.max(0, P - callStrike) - callPremium) * positionSize;
    const shortLegPnL = shortStockPnL + callPnL;
    // Combined
    const totalPnL = longLegPnL + shortLegPnL;
    data.push({ price: Math.round(P * 100) / 100, pnl: Math.round(totalPnL * 100) / 100 });
    longLeg.push({ price: Math.round(P * 100) / 100, pnl: Math.round(longLegPnL * 100) / 100 });
    shortLeg.push({ price: Math.round(P * 100) / 100, pnl: Math.round(shortLegPnL * 100) / 100 });
  }

  // Breakeven points (approximate)
  // 1. Upward: spot + total premiums
  // 2. Downward: spot - total premiums
  const totalPremiums = Number(putPremium) + Number(callPremium);
  breakevens = [
    Number(spotPrice) + totalPremiums,
    Number(spotPrice) - totalPremiums,
  ];

  // Max loss is total premiums paid (if price stays in range)
  maxLoss = -totalPremiums * positionSize;
  // Max gain is theoretically unlimited, but for chart, use min/max of data
  maxGain = Math.max(...data.map(d => d.pnl));

  return { data, longLeg, shortLeg, breakevens, maxLoss, maxGain };
}

function getScenarios({ spotPrice, putStrike, callStrike, putPremium, callPremium }) {
  const totalPremiums = Number(putPremium) + Number(callPremium);
  return [
    {
      priceScenario: `P > ${Number(callStrike) + totalPremiums}`,
      netResult: 'Profit from short leg call option offsets losses',
      source: 'Gains from short call + long stock',
    },
    {
      priceScenario: `P < ${Number(putStrike) - totalPremiums}`,
      netResult: 'Profit from long put option offsets losses',
      source: 'Gains from long put + short stock',
    },
    {
      priceScenario: `${Number(putStrike) + totalPremiums} < P < ${Number(callStrike) - totalPremiums}`,
      netResult: 'Loss limited to premiums paid',
      source: 'Both options expire worthless',
    },
  ];
}

function App() {
  const [values, setValues] = useState(defaultValues);

  const { data, longLeg, shortLeg, breakevens, maxLoss, maxGain } = useMemo(() => calculatePnL(values), [values]);
  const scenarios = useMemo(() => getScenarios(values), [values]);

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1 className="mb-4 text-center">Hedging Strategy Calculator</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6} lg={5}>
          <InputForm values={values} onChange={setValues} />
        </Col>
        <Col md={6} lg={7}>
          <Card className="glass-card mb-4">
            <Card.Body>
              <Card.Title>Strategy Hypothesis & Outcomes</Card.Title>
              <Card.Text>
                This strategy combines a long and short stock position, each hedged with an opposite option. The goal is to cap risk and profit from volatility. The maximum loss is limited to the total premiums paid. Profit occurs if the stock moves beyond the breakeven points.
              </Card.Text>
              <SummaryTable scenarios={scenarios} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card className="glass-card mb-4">
            <Card.Body>
              <Card.Title>Main P&amp;L Chart (Combined)</Card.Title>
              <PnLChart data={data} breakevenPoints={breakevens} maxLoss={maxLoss} maxGain={maxGain} spotPrice={values.spotPrice} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="glass-card mb-4">
            <Card.Body>
              <Card.Title>Long Stock + Put Option</Card.Title>
              <PnLChart data={longLeg} spotPrice={values.spotPrice} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="glass-card mb-4">
            <Card.Body>
              <Card.Title>Short Stock + Call Option</Card.Title>
              <PnLChart data={shortLeg} spotPrice={values.spotPrice} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
