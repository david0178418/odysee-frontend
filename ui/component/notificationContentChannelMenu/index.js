import { connect } from 'react-redux';
import { doToast } from 'redux/actions/notifications';
import { doToggleSubscription } from 'redux/actions/subscriptions';
import { makeSelectNotificationsDisabled } from 'redux/selectors/subscriptions';
import NotificationContentChannelMenu from './view';

const select = (state, props) => ({
  notificationsDisabled: makeSelectNotificationsDisabled(props.uri)(state),
});

export default connect(select, {
  doToggleSubscription,
  doToast,
})(NotificationContentChannelMenu);
