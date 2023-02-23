import { ClockIcon } from 'notifi-react-card/lib/assets/ClockIcon';
import React from 'react';

import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from './AlertNotificationRow';

type ReminderDetailEventRenderer = Readonly<{
  createdDate: string;
  message: string | undefined;
  subject: string | undefined;
  notificationTitle: string;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
}>;

export const ReminderDetailEventRenderer: React.FC<
  ReminderDetailEventRenderer
> = ({
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
      notificationImage={<ClockIcon />}
      notificationSubject={subject}
      notificationDate={createdDate}
      notificationMessage={message}
      classNames={classNames}
    />
  );
};
