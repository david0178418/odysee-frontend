import { connect } from 'react-redux';
import { doAbandonTxo, doAbandonClaim } from 'redux/actions/claims';
import { doHideModal } from 'redux/actions/app';
import ModalRevokeClaim from './view';

const perform = (dispatch, ownProps) => {
  const { claim, tx, cb } = ownProps;

  return {
    doRevoke: () => dispatch((claim && doAbandonClaim(claim.txid, claim.nout, cb)) || (tx && doAbandonTxo(tx, cb))),
    closeModal: () => dispatch(doHideModal()),
  };
};

export default connect(null, perform)(ModalRevokeClaim);
