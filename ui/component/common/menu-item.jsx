// @flow
import React from 'react';
import { MenuItem as ReachMenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';

type Props = {
  icon: string,
  label: string,
  help?: string | any,
  onSelect: (any) => any,
};

export default function MenuItem(props: Props) {
  const { icon, label, help, onSelect } = props;

  return (
    <ReachMenuItem onSelect={onSelect}>
      <div className="menu__item">
        <Icon aria-hidden icon={icon} />
        {label}
      </div>

      {help && <span className="menu__item-help">{help}</span>}
    </ReachMenuItem>
  );
}
