# `@notifi/notifi-react-hooks`

> _Updated July 14, 2022_

## 🙋🏻‍♀️ Introduction

Notifi provides notification infrastructure for web3 services and dApps to communicate with their end users.

`notifi-react-hooks` is an SDK designed for React dApp developers to integrate Notifi's services via an easy-to-use Hooks interface.

To see the latest updates on supported L1 and messaging channels and to see what's coming up, check out [Notifi.Network](www.notifi.network) and join the [Discord Community](https://discord.com/invite/nAqR3mk3rv).

To use Notifi, dApps need to onboard to Notifi's services and users are required to authenticate their wallet address by connecting their wallet and signing for the transaction to get notifications.

Currently supported notifications:

- Email Notifications
- SMS Notifications to mobile numbers with country code (ex: +15557771234)
- Telegram (Ask our Discord #integration-requests channel for help setting up your bot! https://discord.com/channels/939658182509334538/950415885619843082)

## 🎬 Getting Started

In this README, we'll cover the simple use case of one user creating one alert for one wallet address. These patterns can be extended for more complex use cases where there are multiple alerts on several wallets with specific filters for each.

## 📚 Prerequistes

1. Join the [Discord Community](https://discord.com/invite/nAqR3mk3rv) to get support
1. Hit up the devs in the [#integration-requests](https://discord.com/channels/939658182509334538/950415885619843082) channel to get onboarded to Notifi's services

## 📥 Installation

```
npm i @notifi-network/notifi-react-hooks
```

## 🧩 Build Your UI Components

Common patterns for UI involve rendering a form in a modal or card to collect the user's contact information (Email, SMS, Telegram, etc). Below is are example UIs from the integrations with

## 🪝 Hook up the SDK

Load the Notifi React Hooks SDK into your component.

```
const notifiReactHooks = require('@notifi-network/notifi-react-hooks');
```

Instantiate and configure the Notifi Client for your dApp and environment. If your user has not connected their wallet, they will need to do so in order to instantiate the client.

```
const notifiClient = notifiReactHooks.useNotifiClient({
  dappAddress: <dApp ID>,
  env: BlockchainEnvironment,
  walletPublicKey: <Connected Wallet Public Key>,
});
```

> 📝 Onboard your dApp with Notifi to get your "dApp ID" on the allowlist via the Discord #integration-requests channel https://discord.com/channels/939658182509334538/950415885619843082

## 🔏 Signature Authorization

For a user to opt-in for notifications, they will need to provide their signature. This signature will then be used to authorize the user's connected wallet address with Notifi and create the account with Notifi.

Using the wallet adapter of your choice, prompt the user to sign and use the signed message in the `logIn()` hook.

If the server responds with an error, the hook will throw an error of the [type `GqlError`](https://notifi-network.github.io/notifi-sdk-ts/classes/GqlError.html).

```
const {logIn} = notifiClient;

const handleLogIn = () => {
  try {
    await logIn({signMessage: <Signature>})
  } catch (e) {
    if (e instanceof GqlError) {
      // handle the Notifi GqlError
    }
  }
}

```

> 📝 The signature type will vary depending on the wallet adapter. Connect with the Notifi devs to ensure success for your scenario

## 🕹 Rendering Alert Options

After the user successfully authorizes, fetch the newly created user data from Notifi using the `fetchData()` hook. This returns the [type `ClientData`](https://notifi-network.github.io/notifi-sdk-ts/modules.html#ClientData).

In our simplest use case, the user will have 1 entry in the `sources` array, which will be based on their connected wallet address. More about the [`Source` type here](https://notifi-network.github.io/notifi-sdk-ts/modules.html#Source). Use the id of the source when creating the alert later on.

For Metaplex/Bonfida auction sources, we provide hooks to help create the sources: createMetaplexAuctionSource and createBonfidaAuctionSource
This allows the caller to specify the auction ID, along with an auction name or URL for a user to receive in their notifications.

```
const {fetchData} = notifiClient;
const data = fetchData();

// An array of sources that belong to the user
const {sources} = data;
```

You'll want to render the alert options available for the user's source, based on what is returned in the source's `applicableFilters` array. More about the [`Filter` type here](https://notifi-network.github.io/notifi-sdk-ts/modules.html#Filter).

There are a handful of available options for different sources with new options on the horizon. Join the [Discord Community](https://discord.com/invite/nAqR3mk3rv) to get the latest updates.

```
// Render the options to the user
const {id, applicableFilters} = sources?.[0];
const filterId = applicableFilters?.[0].id;
```

For more complex scenarios where the user has multiple sources, you may want to iterate over each source to accumulate the applicable filters to render.

## 🪢 Create the Alert

Once your user enters their contact information and options for their first alert, use the `createAlert()` hook. This accepts the [ClientCreateAlertInput shape](https://notifi-network.github.io/notifi-sdk-ts/modules.html#ClientCreateAlertInput) and will return the [`Alert` object](https://notifi-network.github.io/notifi-sdk-ts/modules.html#Alert) in the response upon success.

```
const {createAlert} = notifiClient;

// User Input
const [contactInfo, setContactInfo] = useState<ContactForm>({
    emailAddress: null,
    phoneNumber: null,
    telegramId: null,
  });
const [filterId, setFilterId] = useState<string>('');

...

const handleCreateAlert () => {
  try {
    const response = await createAlert({
      emailAddress: contactInfo.emailAddress,
      filterId: filterId,
      name: 'my first gmgn dApp unique notification name',
      phoneNumber: contactInfo.phoneNumber,
      sourceId: sources?.[0]?.id,
      telegramId: contactInfo.telegramId,
    });
    return response;
  } catch (e) {
    if (e instanceof GqlError) {
      // handle the Notifi GqlError
    }
  }
}

```

This input also accepts a [`filterOptions` parameter](https://notifi-network.github.io/notifi-sdk-ts/modules.html#FilterOptions), if applicable for the chosen filter type, to configure the conditions of when a notification gets triggered:

```
const {createAlert} = notifiClient;

// User Input
const [contactInfo, setContactInfo] = useState<ContactForm>({
    emailAddress: null,
    phoneNumber: null,
    telegramId: null,
  });
const [filterId, setFilterId] = useState<string>('');
const [health, setHealth] = useState<number>(10);

...

const handleCreateAlert () => {
  try {
    const response = await createAlert({
      emailAddress: contactInfo.emailAddress,
      filterId: filterId,
      filterOptions: {
        alertFrequency: 'SINGLE',
        threshold: health,
      },
      name: 'my first gmgn dApp unique notification name',
      phoneNumber: contactInfo.phoneNumber,
      sourceId: sources?.[0]?.id,
      telegramId: contactInfo.telegramId,
    });
    return response;
  } catch (e) {
    if (e instanceof GqlError) {
      // handle the Notifi GqlError
    }
  }
}

```

## 🔃 Updating the Alert

If a user wants to update their alert by changing the email address notifications are sent to, or to add a phone number for SMS notifications, updating the alert is handled by using the `updateAlert()` hook. It takes the [type `ClientUpdateAlertInput`](https://notifi-network.github.io/notifi-sdk-ts/modules.html#ClientUpdateAlertInput).

You'll want to pass in the `id` of the existing alert to make the update to that alert entity. In our simplest use case, where the user only has 1 alert in their account, fetch the user's persisted data using `fetchData()` and get the id of the alert to delete.

```
const {fetchData, updateAlert} = notifiClient;

const handleUpdateAlert = () => {
  try {
    const {alerts} = fetchData();
    const response = await updateAlert({
      alertId: alerts?.[0]?.id,
      emailAddress: <New Email Address | null>,
      phoneNumber: <New Phone Number | null>,
      telegramId: <New Telegram ID | null>,
    });
    return response;
  } catch (e) {
    if (e instanceof GqlError) {
      // handle the Notifi GqlError
    }
  }
}

```

## 🗑 Deleting the Alert

To delete an alert, use the `deleteAlert()` hook, which simply [takes the `id` of the alert](https://notifi-network.github.io/notifi-sdk-ts/modules.html#ClientDeleteAlertInput) to be deleted. In our use case where the user only has 1 alert in their account:

```
const {fetchData, deleteAlert} = notifiClient;

const handleDeleteAlert = () => {
  try {
    const {alerts} = fetchData();
    const response = await deleteAlert({
      alertId: alerts?.[0]?.id,
    });
    return response;
  } catch (e) {
    if (e instanceof GqlError) {
      // handle the Notifi GqlError
    }
  }
}
```

## 🧯 Error Handling

`notifi-react-hooks` wrap Notifi server errors and throw the [type `GqlError`](https://notifi-network.github.io/notifi-sdk-ts/classes/GqlError.html).

An example of how to handle these errors in clientside code:

```
const handleError = (errors: { message: string }[]) => {
    const error = errors.length > 0 ? errors[0] : null;
    if (error instanceof GqlError) {
      setErrorMessage(
        `${error.message}: ${error.getErrorMessages().join(', ')}`
      );
    } else {
      setErrorMessage(error?.message ?? 'Unknown error');
    }
  }
```

[mango-modal-example]: ../images/mango_modal_example.png
[realms-card-example]: ../images/realms_card_example.png

## Broadcast Message Example

The following example fetches `UserTopics` and allows the user to send a message via `broadcastMessage`

```tsx
import { UserTopic } from '@notifi-network/notifi-core';
import type { MessageSigner } from '@notifi-network/notifi-react-hooks';
import { useNotifiClient } from '@notifi-network/notifi-react-hooks';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type Props = Readonly<{
  dappAddress: string;
  signer: MessageSigner;
  walletPublicKey: string;
}>;

export const ConnectedForm: React.FC<Props> = ({
  dappAddress,
  signer,
  walletPublicKey,
}) => {
  const [topics, setTopics] = useState<ReadonlyArray<UserTopic>>([]);
  const [topic, setTopic] = useState<UserTopic | undefined>(undefined);
  const shouldFetch = useRef(true);

  const { broadcastMessage, getTopics, logIn, logOut, isAuthenticated } =
    useNotifiClient({
      dappAddress,
      walletPublicKey,
      env: 'Development',
    });

  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isHolderOnly, setIsHolderOnly] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthenticated && shouldFetch.current) {
      shouldFetch.current = false;

      getTopics()
        .then((topics) => {
          setTopics(topics);
          if (topic === undefined) {
            setTopic(topics[0]);
          }
        })
        .catch((e: unknown) => {
          console.log('Error getting topics', e);
        });
    }

    if (!isAuthenticated) {
      shouldFetch.current = true;
    }
  }, [getTopics, isAuthenticated, topic]);

  const { topicsKeys, topicsMap } = useMemo(() => {
    const map = topics.reduce((m, topic) => {
      if (topic.topicName !== null) {
        m[topic.topicName] = topic;
      }
      return m;
    }, {} as Record<string, UserTopic>);

    const keys = Object.keys(map);
    return {
      topicsKeys: keys,
      topicsMap: map,
    };
  }, [topics]);

  const handleSubmit = useCallback(
    async (t: UserTopic | undefined, s: string, m: string, i: boolean) => {
      if (t === undefined) {
        return;
      }
      try {
        broadcastMessage(
          {
            topic: t,
            subject: s,
            message: m,
            isHolderOnly: i,
          },
          signer,
        );
      } catch (e: unknown) {
        console.log('Error during broadcastMessage', e);
      }
    },
    [broadcastMessage, signer],
  );

  return (
    <div>
      <h1>Send Broadcast Message</h1>
      <select
        value={topic?.topicName ?? ''}
        onChange={(e) => {
          const name = e.target.value;
          setTopic(topicsMap[name]);
        }}
      >
        {topicsKeys.map((key) => {
          return (
            <option key={key} value="key">
              {topicsMap[key].name}
            </option>
          );
        })}
      </select>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <input
        type="checkbox"
        checked={isHolderOnly}
        onChange={(e) => setIsHolderOnly(e.target.checked)}
      ></input>
      <button
        onClick={() => handleSubmit(topic, subject, message, isHolderOnly)}
      >
        Submit
      </button>
      {isAuthenticated ? (
        <button
          onClick={() => {
            logOut()
              .then(() => console.log('Done'))
              .catch(console.log);
          }}
        >
          Log Out
        </button>
      ) : (
        <button
          onClick={() => {
            logIn(signer)
              .then((user) => console.log('Done', user))
              .catch(console.log);
          }}
        >
          Log In
        </button>
      )}
    </div>
  );
};
```

## Logging in via a Transaction

If the user's wallet does not support `signMessage`, we need to sign in via a transaction. This involves three steps:

- Obtain nonce from Notifi and hash it
- Broadcast a transaction which will print the hash
- Complete the login with Notifi by submitting the transaction signature

### Obtaining a nonce from Notifi

```tsx
const {
  beginLoginViaTransaction,
} = useNotifiClient({ ... });

const getHashedNonce = useCallback(async (): Promise<string> => {
  const { logValue } = await beginLoginViaTransaction();
  return logValue;
}, [beginLoginViaTransaction]);
```

### Broadcast a transaction

```tsx
const broadcastTxn = useCallback(
  async (logValue: string): Promise<string> => {
    if (logValue === '') {
      throw new Error('Invalid log value');
    }

    const txn = new Transaction();
    txn.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey,
            isSigner: true,
            isWritable: false,
          },
        ],
        data: Buffer.from(msg, 'utf-8'),
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      }),
    );

    const broadcasted = await wallet.sendTransaction(txn, connection);
    return broadcasted;
  },
  [pubkey, wallet, connection],
);
```

### Complete login

```tsx
const {
  completeLoginViaTransaction,
} = useNotifiClient({ ... });

const completeLogin = useCallback(async (transactionSignature: string): Promise<User> => {
  const result = await completeLoginViaTransaction({
    transactionSignature,
  });
  return result;
}, [completeLoginViaTransaction]);
```
