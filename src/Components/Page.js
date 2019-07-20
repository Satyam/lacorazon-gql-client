import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default function Page({ wide, children, title, heading, action }) {
  document.title = `La Corazón - ${title}`;
  return (
    <Container fluid>
      <Row>
        <Col sm="12" md={{ size: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
          <h1 style={{ float: 'left' }}>{heading}</h1>
          <span style={{ float: 'right' }}>{action}</span>
          {children}
        </Col>
      </Row>
    </Container>
  );
}
