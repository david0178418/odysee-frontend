import { connect } from 'react-redux';
import { selectClaimForUri, selectClaimIsMine } from 'redux/selectors/claims';
import { doCollectionEdit, doFetchItemsInCollection } from 'redux/actions/collections';
import { doPrepareEdit } from 'redux/actions/publish';
import {
  makeSelectCollectionForIdHasClaimUrl,
  makeSelectCollectionIsMine,
  makeSelectEditedCollectionForId,
  makeSelectUrlsForCollectionId,
} from 'redux/selectors/collections';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { selectChannelIsMuted } from 'redux/selectors/blocked';
import { doToggleMuteChannel } from 'redux/actions/blocked';
import { doSetActiveChannel, doSetIncognito, doOpenModal } from 'redux/actions/app';
import { doToggleBlockChannel, doToggleBlockChannelAsAdmin } from 'redux/actions/comments';
import { selectHasAdminChannel, selectChannelIsBlocked, selectChannelIsAdminBlocked } from 'redux/selectors/comments';
import { doToast } from 'redux/actions/notifications';
import { doToggleSubscription } from 'redux/actions/subscriptions';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectListShuffle } from 'redux/selectors/content';
import { doToggleShuffleList } from 'redux/actions/content';
import { getChannelPermanentUrlFromClaim, getIsClaimPlayable } from 'util/claim';
import ClaimPreview from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri, false);

  const contentClaim = (claim && claim.reposted_claim) || claim;
  const contentUrl = contentClaim && contentClaim.permanent_url;
  const contentChannelUrl = getChannelPermanentUrlFromClaim(contentClaim);
  const isPlayable = getIsClaimPlayable(contentClaim);

  const isCollectionClaim = claim && claim.value_type === 'collection';
  const collectionClaimId = isCollectionClaim && claim && claim.claim_id;
  const shuffleList = collectionClaimId && selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === collectionClaimId && shuffleList.newUrls;

  return {
    channelIsAdminBlocked: contentChannelUrl && selectChannelIsAdminBlocked(state, contentChannelUrl),
    channelIsBlocked: contentChannelUrl && selectChannelIsBlocked(state, contentChannelUrl),
    channelIsMuted: contentChannelUrl && selectChannelIsMuted(state, contentChannelUrl),
    claim,
    claimIsMine: claim && selectClaimIsMine(state, claim),
    editedCollection: collectionClaimId && makeSelectEditedCollectionForId(collectionClaimId)(state),
    hasClaimInFavorites:
      isPlayable && makeSelectCollectionForIdHasClaimUrl(COLLECTIONS_CONSTS.FAVORITES_ID, contentUrl)(state),
    hasClaimInWatchLater:
      isPlayable && makeSelectCollectionForIdHasClaimUrl(COLLECTIONS_CONSTS.WATCH_LATER_ID, contentUrl)(state),
    isAdmin: selectHasAdminChannel(state),
    isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
    isMyCollection: collectionClaimId && makeSelectCollectionIsMine(collectionClaimId)(state),
    isSubscribed: contentChannelUrl && selectIsSubscribedForUri(state, contentChannelUrl),
    playNextUri: shuffle && shuffle[0],
    resolvedList: collectionClaimId && makeSelectUrlsForCollectionId(collectionClaimId)(state),
  };
};

const perform = (dispatch) => ({
  doCollectionEdit: (collection, props) => dispatch(doCollectionEdit(collection, props)),
  doToast: (props) => dispatch(doToast(props)),
  doToggleShuffleList: (collectionId) => dispatch(doToggleShuffleList(undefined, collectionId, true, true)),
  fetchCollectionItems: (collectionId) => dispatch(doFetchItemsInCollection({ collectionId })),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  prepareEdit: (publishData, uri) => {
    if (publishData.signing_channel) {
      dispatch(doSetIncognito(false));
      dispatch(doSetActiveChannel(publishData.signing_channel.claim_id));
    } else {
      dispatch(doSetIncognito(true));
    }

    dispatch(doPrepareEdit(publishData, uri));
  },
  toggleAdminBlock: (channelUri) => dispatch(doToggleBlockChannelAsAdmin(channelUri)),
  toggleModBlock: (channelUri) => dispatch(doToggleBlockChannel(channelUri)),
  toggleMute: (channelUri) => dispatch(doToggleMuteChannel(channelUri)),
  toggleSubscribe: (subscription) => dispatch(doToggleSubscription(subscription)),
});

export default connect(select, perform)(ClaimPreview);
