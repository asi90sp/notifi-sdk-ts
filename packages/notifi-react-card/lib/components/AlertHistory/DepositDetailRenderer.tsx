import { EventCheckmarkIcon } from 'notifi-react-card/lib/assets/EventCheckmarkIcon';
import React from 'react';

import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from './AlertNotificationRow';

type DepositDetailRenderer = Readonly<{
  createdDate: string;
  message: string | undefined;
  subject: string | undefined;
  notificationTitle: string;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
}>;

export const DepositDetailRenderer: React.FC<DepositDetailRenderer> = ({
  message,
  subject,
  createdDate,
  notificationTitle,
  handleAlertEntrySelection,
  classNames,
}) => {
  return (
    <AlertNotificationRow
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationTitle={notificationTitle}
      notificationImage={<EventCheckmarkIcon />}
      notificationSubject={subject}
      notificationDate={createdDate}
      notificationMessage={message}
      classNames={classNames}
    />
  );
};
