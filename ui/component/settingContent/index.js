import { connect } from 'react-redux';
import { SETTINGS } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import { doSetPlayingUri } from 'redux/actions/content';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectShowMatureContent, makeSelectClientSetting } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import SettingContent from './view';

const select = (state) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  floatingPlayer: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  showNsfw: selectShowMatureContent(state),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  openModal: (id, params) => dispatch(doOpenModal(id, params)),
});

export default connect(select, perform)(SettingContent);
