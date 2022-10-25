// @flow
import React from 'react';
import analytics from 'analytics';

import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';

import { useHistory } from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { Form, Submit, FormErrors } from 'component/common/form';
import { COLLECTION_PAGE } from 'constants/urlParams';

import Button from 'component/button';
import ClaimAbandonButton from 'component/claimAbandonButton';
import CollectionItemsList from 'component/collectionItemsList';
import Spinner from 'component/spinner';
import BusyIndicator from 'component/common/busy-indicator';
import Tooltip from 'component/common/tooltip';
import CollectionGeneralTab from './internal/collectionGeneralTab';

export const PAGE_TAB_QUERY = `tab`;

const TAB = {
  GENERAL: 0,
  ITEMS: 1,
};

type Props = {
  collectionId: string,
  onDoneForId: (string) => void,
  // -- redux -
  hasClaim: boolean,
  collectionParams: CollectionPublishCreateParams | CollectionPublishUpdateParams,
  updatingCollection: boolean,
  creatingCollection: boolean,
  activeChannelClaim: ?ChannelClaim,
  collectionHasEdits: boolean,
  doCollectionPublishUpdate: (CollectionPublishUpdateParams) => Promise<any>,
  doCollectionPublish: (CollectionPublishCreateParams, string) => Promise<any>,
  doCollectionEdit: (id: string, params: CollectionEditParams) => void,
  doClearEditsForCollectionId: (id: string) => void,
  doOpenModal: (id: string, props: {}) => void,
};

export const CollectionFormContext = React.createContext<any>();

const CollectionPublishForm = (props: Props) => {
  const {
    collectionId,
    onDoneForId,
    // -- redux -
    hasClaim,
    collectionParams,
    updatingCollection,
    creatingCollection,
    activeChannelClaim,
    collectionHasEdits,
    doCollectionPublishUpdate,
    doCollectionPublish,
    doCollectionEdit,
    doClearEditsForCollectionId,
    doOpenModal,
  } = props;

  const initialParams = React.useRef(collectionParams);
  const collectionResetPending = React.useRef(false);

  const {
    push,
    goBack,
    location: { search },
  } = useHistory();

  const urlParams = new URLSearchParams(search);
  const editing = urlParams.get(COLLECTION_PAGE.QUERIES.VIEW) === COLLECTION_PAGE.VIEWS.EDIT;
  const publishing = urlParams.get(COLLECTION_PAGE.QUERIES.VIEW) === COLLECTION_PAGE.VIEWS.PUBLISH;

  const [thumbailError, setThumbnailError] = React.useState();
  const [formParams, setFormParams] = React.useState(collectionParams);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [showItemsSpinner, setShowItemsSpinner] = React.useState(false);

  const { claims } = formParams;

  const hasClaims = claims && claims.length;
  const itemError = publishing && !hasClaims ? __('Cannot publish empty list') : undefined;
  const hasChanges = JSON.stringify(initialParams.current) !== JSON.stringify(formParams);

  function updateFormParams(newParams: {}) {
    setFormParams((prevParams) => ({ ...prevParams, ...newParams }));
  }

  function handleSubmitForm() {
    if (!hasChanges) return goBack();

    if (editing) {
      // $FlowFixMe
      doCollectionEdit(collectionId, formParams);

      return onDoneForId(collectionId);
    }

    const successCb = (pendingClaim) => {
      if (pendingClaim) {
        const claimId = pendingClaim.claim_id;
        analytics.apiLog.publish(pendingClaim);
        onDoneForId(claimId);
      }
    };

    if (hasClaim) {
      // $FlowFixMe
      doCollectionPublishUpdate(formParams).then(successCb);
    } else {
      // $FlowFixMe
      doCollectionPublish(formParams, collectionId).then(successCb);
    }
  }

  function onTabChange(newTabIndex) {
    if (tabIndex !== newTabIndex) {
      if (newTabIndex === TAB.ITEMS) {
        setShowItemsSpinner(true);
        setTimeout(() => {
          // Wait enough time for the spinner to appear, then switch tabs.
          setTabIndex(newTabIndex);
          // We can stop the spinner immediately. If the list takes a long time
          // to render, the spinner would continue to spin until the
          // state-change is flushed.
          setShowItemsSpinner(false);
        }, 250);
      } else {
        setTabIndex(newTabIndex);
      }
    }
  }

  // Reset the form to original collection state if the edits are cleared
  React.useEffect(() => {
    if (collectionParams && collectionResetPending.current) {
      // $FlowFixMe
      setFormParams(collectionParams);

      initialParams.current = collectionParams;
      collectionResetPending.current = false;
    }
  }, [collectionParams]);

  if (publishing && activeChannelClaim === undefined) {
    return (
      <div className="main--empty">
        <Spinner />
      </div>
    );
  }

  return (
    <Form
      className="main--contained collection-publish-form__wrapper"
      onSubmit={handleSubmitForm}
      errors={{ ...(itemError ? { items: itemError } : {}), ...(thumbailError ? { thumbnail: thumbailError } : {}) }}
    >
      <CollectionFormContext.Provider value={{ formParams, updateFormParams }}>
        <Tabs onChange={onTabChange} index={tabIndex}>
          <TabList className="tabs__list--collection-edit-page">
            <Tab>{__('General')}</Tab>
            <Tab>
              {__('Items')}
              {showItemsSpinner && <Spinner type="small" />}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {tabIndex === TAB.GENERAL && (
                <CollectionGeneralTab
                  collectionId={collectionId}
                  formParams={formParams}
                  setThumbnailError={setThumbnailError}
                  updateFormParams={updateFormParams}
                />
              )}
            </TabPanel>

            <TabPanel>
              {tabIndex === TAB.ITEMS && (
                <CollectionItemsList collectionId={collectionId} empty={__('This playlist has no items.')} showEdit />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div className="section__actions">
          <Submit
            button="primary"
            disabled={(publishing && !collectionHasEdits && !hasChanges) || creatingCollection || updatingCollection}
            label={
              creatingCollection || updatingCollection ? <BusyIndicator message={__('Submitting')} /> : __('Submit')
            }
          />
          <Button button="link" label={__('Cancel')} onClick={goBack} />

          {collectionHasEdits && (
            <Tooltip title={__('Delete all edits from this published playlist')}>
              <Button
                button="close"
                icon={ICONS.REFRESH}
                label={__('Clear Updates')}
                onClick={() =>
                  doOpenModal(MODALS.CONFIRM, {
                    title: __('Clear Updates'),
                    subtitle: __(
                      "Are you sure you want to delete all edits from this published playlist? (You won't be able to undo this action later)"
                    ),
                    onConfirm: (closeModal) => {
                      doClearEditsForCollectionId(collectionId);
                      collectionResetPending.current = true;
                      closeModal();
                    },
                  })
                }
              />
            </Tooltip>
          )}
        </div>

        <FormErrors />

        <p className="help">
          {publishing
            ? __('After submitting, it will take a few minutes for your changes to be live for everyone.')
            : __('After submitting, all changes will remain private')}
        </p>

        {hasClaim && (
          <div className="section__actions">
            <ClaimAbandonButton claimId={collectionId} abandonActionCallback={() => push(`/$/${PAGES.LIBRARY}`)} />
          </div>
        )}
      </CollectionFormContext.Provider>
    </Form>
  );
};

export default CollectionPublishForm;
