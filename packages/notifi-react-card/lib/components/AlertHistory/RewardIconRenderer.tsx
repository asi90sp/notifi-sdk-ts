import { StarEventicon } from 'notifi-react-card/lib/assets/StarEventIcon';
import React from 'react';

import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from './AlertNotificationRow';

type RewardIconRenderer = Readonly<{
  createdDate: string;
  message: string | undefined;
  subject: string | undefined;
  notificationTitle: string;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
}>;

export const RewardIconRenderer: React.FC<RewardIconRenderer> = ({
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
      notificationImage={<StarEventicon />}
      notificationSubject={subject}
      notificationDate={createdDate}
      notificationMessage={message}
      classNames={classNames}
    />
  );
};
