import React, { useState, cloneElement, Children } from 'react';
import invariant from 'invariant';

import { AccordionPanelProps } from './AccordionPanel';

type AccordionProps = {
  mutuallyExclusive?: boolean;
  allClose?: boolean;
  initiallyOpen?: string[];
  children: React.ReactElement<AccordionPanelProps>[];
};
const Accordion = ({
  mutuallyExclusive = true,
  allClose = true,
  initiallyOpen = [],
  children,
}: AccordionProps) => {
  const [nowOpen, setOpen] = useState<string[]>(initiallyOpen);

  const elements = Children.toArray(children);
  invariant(elements.length > 1, 'Accordion should have multiple panels');

  if (mutuallyExclusive && nowOpen.length > 1) {
    setOpen([nowOpen[0]]);
  }

  if (!allClose && nowOpen.length === 0) {
    setOpen([elements[0].props.name]);
  }

  const onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target instanceof HTMLButtonElement && 'name' in ev.target.dataset) {
      ev.stopPropagation();
      const name = String(ev.target.dataset.name);
      if (nowOpen.includes(name)) {
        if (allClose || nowOpen.length > 1) {
          setOpen(nowOpen.filter(k => k !== name));
        }
      } else {
        if (mutuallyExclusive) {
          setOpen([name]);
        } else {
          setOpen(nowOpen.concat(name));
        }
      }
    }
  };
  return (
    <div className="accordion" onClick={onClick}>
      {elements.map(child => {
        const name = child.props.name;
        return cloneElement(child, { key: name, open: nowOpen.includes(name) });
      })}
    </div>
  );
};

export default Accordion;
