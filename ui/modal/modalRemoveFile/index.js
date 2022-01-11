import { connect } from 'react-redux';
import { doDeleteStreamClaim } from 'redux/actions/file';
import { doHideModal } from 'redux/actions/app';
import { doResolveUri } from 'redux/actions/claims';
import { selectClaimForUri, makeSelectIsAbandoningClaimForUri } from 'redux/selectors/claims';
import ModalRemoveFile from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    claim: selectClaimForUri(state, uri),
    isAbandoning: makeSelectIsAbandoningClaimForUri(uri)(state),
  };
};

const perform = (dispatch, ownProps) => {
  const { uri, doGoBack } = ownProps;

  return {
    closeModal: () => dispatch(doHideModal()),
    deleteClaim: (claim) => dispatch(doDeleteStreamClaim(claim, doGoBack)),
    resolve: () => dispatch(doResolveUri(uri)),
  };
};

export default connect(select, perform)(ModalRemoveFile);
