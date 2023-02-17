import React from 'react';
import ButtonWithConfirmModal from '../ButtonWithConfirmModal';

const IndexCollectionButton = ({ contentType }) => {
  return (
    <ButtonWithConfirmModal
      label="Index Collection"
      prompt="Are you sure you want to index this collection?"
      successMessage="Collection indexed successfully."
      failedMessage="Collection indexing failed."
      endpoint={`/search/index/${contentType}`}
    />
  );
};

export default IndexCollectionButton;
