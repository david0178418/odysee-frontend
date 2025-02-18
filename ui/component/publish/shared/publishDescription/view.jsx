// @flow
import { SIMPLE_SITE } from 'config';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';
import React from 'react';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';
import Card from 'component/common/card';

type Props = {
  disabled: boolean,
  // --- redux ---
  description: ?string,
  updatePublishForm: ({}) => void,
};

function PublishDescription(props: Props) {
  const { description, updatePublishForm, disabled } = props;
  const [advancedEditor, setAdvancedEditor] = usePersistedState('publish-form-description-mode', false);
  function toggleMarkdown() {
    setAdvancedEditor(!advancedEditor);
  }

  return (
    <>
      {disabled && <h2 className="card__title card__title-disabled">{__('Description')}</h2>}
      {!disabled && <h2 className="card__title">{__('Description')}</h2>}
      <Card
        className="card--description"
        actions={
          <FormField
            type={!SIMPLE_SITE && advancedEditor ? 'markdown' : 'textarea'}
            name="content_description"
            placeholder={__(
              'What is your content about? Use this space to include any other relevant details you may like to share about your content and channel.'
            )}
            value={description}
            disabled={disabled}
            onChange={(value) =>
              updatePublishForm({ description: !SIMPLE_SITE && advancedEditor ? value : value.target.value })
            }
            quickActionLabel={!SIMPLE_SITE && (advancedEditor ? __('Simple Editor') : __('Advanced Editor'))}
            quickActionHandler={toggleMarkdown}
            textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
          />
        }
      />
    </>
  );
}

export default PublishDescription;
