// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  isMuted: boolean,
  doToggleMuteChannel: () => void,
};

function ChannelMuteButton(props: Props) {
  const { isMuted, doToggleMuteChannel } = props;

  return (
    <Button
      button={isMuted ? 'alt' : 'secondary'}
      label={isMuted ? __('Unmute') : __('Mute')}
      onClick={doToggleMuteChannel}
    />
  );
}

export default ChannelMuteButton;
