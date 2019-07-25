import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import styles from './styles.module.css';

const Page: React.FC<{
  wide?: boolean;
  title?: string;
  heading: string;
  action?: React.ReactNode;
}> = ({ wide, children, title, heading, action }) => {
  if (title) document.title = `La Corazón - ${title}`;
  return (
    <Container fluid>
      <Row>
        <Col sm="12" md={{ size: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
          <div className={styles.spacing}>
            <h1 className={styles.heading}>{heading}</h1>
            <div className={styles.action}>{action}</div>
          </div>
          <div className={styles.clear}>{children}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
