import React, { useState } from 'react';
import { Button } from '@strapi/design-system/Button';
import Check from '@strapi/icons/Check';
import Information from '@strapi/icons/Information';
import { ConfirmDialog, useNotification } from '@strapi/helper-plugin';
import axiosInstance from '../../utils/axiosInstance';

const ButtonWithConfirmModal = ({ label, prompt, successMessage, failedMessage, endpoint }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleNotification = useNotification();

  function handleToggle() {
    setDialogOpen((prev) => !prev);
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      const results = await axiosInstance.get(endpoint);
      // TODO: accept a "formatResults" function as a prop to format the results
      // TODO: control notification timeout - how long before it auto hides - look in helper plugin git repo
      console.log('results: ', results);
      toggleNotification({
        type: 'success',
        message: {
          id: 'notification.credit-card.update.succeeded',
          defaultMessage: successMessage,
        },
      });
    } catch (err) {
      console.error(err);
      toggleNotification({
        type: 'warning',
        message: {
          id: 'notification.credit-card.update.failed',
          defaultMessage: err instanceof Error ? `${failedMessage} Error: ${err.message}` : failedMessage,
        },
      });
    } finally {
      setLoading(false);
      handleToggle();
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={handleToggle}>
        {label}
      </Button>
      <ConfirmDialog
        bodyText={{
          id: 'app.components',
          defaultMessage: prompt,
        }}
        iconBody={<Information />}
        iconRightButton={<Check />}
        isConfirmButtonLoading={loading}
        isOpen={dialogOpen}
        onToggleDialog={handleToggle}
        onConfirm={async () => await handleConfirm()}
        title={{
          id: 'app.components.ConfirmDialog.title',
          defaultMessage: 'Confirmation',
        }}
        rightButtonText={{
          id: 'app.components.Button.save',
          defaultMessage: 'Yes',
        }}
        variantRightButton="success-light"
      />
    </>
  );
};

export default ButtonWithConfirmModal;
