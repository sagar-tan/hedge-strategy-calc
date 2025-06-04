import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';

function InputForm({ values, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <Card className="glass-card mb-4">
      <Card.Body>
        <Card.Title>Trade Parameters</Card.Title>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="spotPrice">
                <Form.Label>Spot Price (S)</Form.Label>
                <Form.Control type="number" name="spotPrice" value={values.spotPrice} onChange={handleChange} step="0.01" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="positionSize">
                <Form.Label>Position Size</Form.Label>
                <Form.Control type="number" name="positionSize" value={values.positionSize} onChange={handleChange} step="1" min="1" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="putStrike">
                <Form.Label>Put Strike (K_put)</Form.Label>
                <Form.Control type="number" name="putStrike" value={values.putStrike} onChange={handleChange} step="0.01" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="putPremium">
                <Form.Label>Put Premium (P_put)</Form.Label>
                <Form.Control type="number" name="putPremium" value={values.putPremium} onChange={handleChange} step="0.01" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="callStrike">
                <Form.Label>Call Strike (K_call)</Form.Label>
                <Form.Control type="number" name="callStrike" value={values.callStrike} onChange={handleChange} step="0.01" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="callPremium">
                <Form.Label>Call Premium (P_call)</Form.Label>
                <Form.Control type="number" name="callPremium" value={values.callPremium} onChange={handleChange} step="0.01" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="expectedMove">
                <Form.Label>Expected Move (%) (%M)</Form.Label>
                <Form.Control type="number" name="expectedMove" value={values.expectedMove} onChange={handleChange} step="0.01" />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default InputForm; 