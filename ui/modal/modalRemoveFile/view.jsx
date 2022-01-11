// @flow
import { FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import { getClaimTitle } from 'util/claim';
import LbcSymbol from 'component/common/lbc-symbol';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  claim: StreamClaim,
  isAbandoning: boolean,
  closeModal: () => void,
  deleteClaim: (StreamClaim) => void,
  resolve: () => void,
};

export default function ModalRemoveFile(props: Props) {
  const { claim, isAbandoning, closeModal, deleteClaim, resolve } = props;

  const [abandonChecked, setAbandonChecked] = usePersistedState('modal-remove-file:abandon', true);

  React.useEffect(() => {
    if (!claim && !isAbandoning) resolve();
  }, [claim, isAbandoning, resolve]);

  return !claim ? null : (
    <Modal isOpen contentLabel={__('Confirm File Remove')} type="card" onAborted={closeModal}>
      <Card
        title={__('Remove File')}
        subtitle={
          <I18nMessage tokens={{ title: <cite>{`"${getClaimTitle(claim) || ''}"`}</cite> }}>
            Are you sure you'd like to remove %title%?
          </I18nMessage>
        }
        body={
          <>
            <FormField
              name="claim_abandon"
              label={
                <I18nMessage tokens={{ lbc: <LbcSymbol postfix={claim.amount} /> }}>
                  Remove from blockchain (%lbc%)
                </I18nMessage>
              }
              type="checkbox"
              checked={abandonChecked}
              onChange={() => setAbandonChecked(!abandonChecked)}
            />

            {abandonChecked && (
              <p className="help error__text">{__('This action is permanent and cannot be undone')}</p>
            )}
          </>
        }
        actions={
          <>
            <div className="section__actions">
              <Button
                button="primary"
                label={isAbandoning ? __('Removing...') : __('OK')}
                disabled={isAbandoning || !abandonChecked}
                onClick={() => {
                  deleteClaim(claim);
                  closeModal();
                }}
              />

              <Button button="link" label={__('Cancel')} onClick={closeModal} />
            </div>

            <p className="help">{__('These changes will appear shortly.')}</p>
          </>
        }
      />
    </Modal>
  );
}
