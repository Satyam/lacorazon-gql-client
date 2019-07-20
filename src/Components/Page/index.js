import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import styles from './styles.module.css';

export default function Page({ wide, children, title, heading, action }) {
  document.title = `La Corazón - ${title}`;
  return (
    <Container fluid>
      <Row>
        <Col sm="12" md={{ size: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
          <div className={styles.spacing}>
            <h1 className={styles.heading}>{heading}</h1>
            <span className={styles.action}>{action}</span>
          </div>
          {children}
        </Col>
      </Row>
    </Container>
  );
}
