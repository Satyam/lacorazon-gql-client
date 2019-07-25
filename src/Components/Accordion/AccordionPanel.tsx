import React from 'react';
import { Button } from 'reactstrap';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import classNames from 'classnames';

export type AccordionPanelProps = {
  label: string;
  name: string;
  open?: boolean;
};
const AccordionPanel: React.FC<AccordionPanelProps> = ({
  label,
  name,
  open,
  children,
}) => (
  <div className="card">
    <div className="card-header p-0">
      <Button color="secondary" size="sm" block data-name={name}>
        {label}
        {open ? (
          <FaCaretUp className="float-right" />
        ) : (
          <FaCaretDown className="float-right" />
        )}
      </Button>
    </div>

    <div className={classNames('collapse', { show: open })}>
      {open && <div className="card-body p-1">{children} </div>}
    </div>
  </div>
);

export default AccordionPanel;
