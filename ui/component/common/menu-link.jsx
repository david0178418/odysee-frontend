// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { MenuLink as ReachMenuLink } from '@reach/menu-button';
import Icon from 'component/common/icon';

type Props = {
  icon: string,
  label: string,
  page: string,
};

export default function MenuLink(props: Props) {
  const { icon, label, page } = props;

  return (
    <ReachMenuLink className="menu__item" as={Link} to={`/$/${page}`} onClick={(e) => e.stopPropagation()}>
      <Icon aria-hidden icon={icon} />
      {label}
    </ReachMenuLink>
  );
}
