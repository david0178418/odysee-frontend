// @flow
import { FormField } from 'component/common/form';
import { getClaimTitle } from 'util/claim';
import { Modal } from 'modal/modal';
import { useHistory } from 'react-router-dom';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import React from 'react';

type Props = {
  claim: Claim,
  collectionId: string,
  collectionName: string,
  redirect: ?string,
  uri: ?string,
  closeModal: () => void,
  collectionDelete: (string, ?string) => void,
};

function ModalRemoveCollection(props: Props) {
  const { claim, collectionId, collectionName, redirect, uri, closeModal, collectionDelete } = props;

  const { replace } = useHistory();
  const [confirmName, setConfirmName] = React.useState('');
  const title = getClaimTitle(claim);

  return (
    <Modal isOpen contentLabel={__('Confirm List Unpublish')} type="card" onAborted={closeModal}>
      <Card
        title={__('Delete List')}
        body={
          uri ? (
            <>
              <p>{__('This will permanently delete the list.')}</p>
              <p>{__('Type "%name%" to confirm.', { name: collectionName })}</p>
              <FormField value={confirmName} type="text" onChange={(e) => setConfirmName(e.target.value)} />
            </>
          ) : (
            <I18nMessage tokens={{ title: <cite>{uri && title ? `"${title}"` : `"${collectionName}"`}</cite> }}>
              Are you sure you'd like to remove %title%?
            </I18nMessage>
          )
        }
        actions={
          <div className="section__actions">
            <Button
              button="primary"
              label={__('Delete')}
              disabled={uri && collectionName !== confirmName}
              onClick={() => {
                if (redirect) replace(redirect);
                collectionDelete(collectionId, uri ? 'resolved' : undefined);
                closeModal();
              }}
            />
            <Button button="link" label={__('Cancel')} onClick={closeModal} />
          </div>
        }
      />
    </Modal>
  );
}

export default ModalRemoveCollection;
