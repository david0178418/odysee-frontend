// @flow
import { formatLbryUrlForWeb, generateListSearchUrlParams } from 'util/url';
import { Menu, MenuButton, MenuList } from '@reach/menu-button';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import MenuItem from 'component/common/menu-item';
import MenuLink from 'component/common/menu-link';
import React from 'react';

type Props = {
  collectionId: string,
  inline?: boolean,
  shuffleList?: any,
  openDeleteModal: () => void,
  toggleShuffle: () => void,
};

function CollectionMenuList(props: Props) {
  const { collectionId, inline = false, shuffleList, openDeleteModal, toggleShuffle } = props;

  const { push } = useHistory();

  const [doShuffle, setDoShuffle] = React.useState(false);

  const shuffle = shuffleList && shuffleList.collectionId === collectionId && shuffleList.newUrls;
  const playNextUri = shuffle && shuffle[0];

  React.useEffect(() => {
    if (playNextUri && doShuffle) {
      setDoShuffle(false);
      const navigateUrl = formatLbryUrlForWeb(playNextUri);
      push({
        pathname: navigateUrl,
        search: generateListSearchUrlParams(collectionId),
        state: { forceAutoplay: true },
      });
    }
  }, [collectionId, doShuffle, playNextUri, push]);

  return (
    <Menu>
      <MenuButton
        className={classnames('menu__button', { 'claim__menu-button': !inline, 'claim__menu-button--inline': inline })}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Icon size={20} icon={ICONS.MORE_VERTICAL} />
      </MenuButton>

      <MenuList className="menu__list">
        {collectionId && (
          <>
            <MenuLink page={`${PAGES.LIST}/${collectionId}`} icon={ICONS.VIEW} label={__('View List')} />

            <MenuItem
              onSelect={() => {
                toggleShuffle();
                setDoShuffle(true);
              }}
              icon={ICONS.SHUFFLE}
              label={__('Shuffle Play')}
            />

            <MenuLink
              page={`${PAGES.LIST}/${collectionId}?view=edit`}
              icon={ICONS.PUBLISH}
              label={__('Publish List')}
            />

            <MenuItem onSelect={openDeleteModal} icon={ICONS.DELETE} label={__('Delete List')} />
          </>
        )}
      </MenuList>
    </Menu>
  );
}

export default CollectionMenuList;
