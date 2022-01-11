import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import ShareButton from './view';

const select = (state, props) => ({});

export default connect(select, {
  doOpenModal,
  doToast,
})(ShareButton);
