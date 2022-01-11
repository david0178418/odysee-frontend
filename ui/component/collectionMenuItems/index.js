import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doToggleShuffleList } from 'redux/actions/content';
import { makeSelectEditedCollectionForId } from 'redux/selectors/collections';
import { selectListShuffle } from 'redux/selectors/content';
import * as MODALS from 'constants/modal_types';
import CollectionMenuItems from './view';

const select = (state, props) => {
  const { collectionId } = props;

  return {
    editedCollection: makeSelectEditedCollectionForId(collectionId)(state),
    shuffleList: selectListShuffle(state),
  };
};

const perform = (dispatch, ownProps) => {
  const { collectionId } = ownProps;

  return {
    toggleShuffle: () => dispatch(doToggleShuffleList(undefined, collectionId, true, true)),
    openDeleteModal: () => dispatch(doOpenModal(MODALS.COLLECTION_DELETE, { collectionId })),
  };
};

export default connect(select, perform)(CollectionMenuItems);
