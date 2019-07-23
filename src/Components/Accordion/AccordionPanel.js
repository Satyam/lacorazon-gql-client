import React from 'react';
import { Button } from 'reactstrap';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import classNames from 'classnames';

export default function AccordionPanel({ label, name, open, children }) {
  return (
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
}
