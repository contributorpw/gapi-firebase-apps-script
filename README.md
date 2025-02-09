# GAPI and Firebase Auth and Apps Script Executable API

An example of how to use GAPI and Firebase Auth together to authenticate users
and talk to Google APIs.

Have a question? Book a slot to chat further or [open an issue](https://github.com/contributorpw/gapi-firebase-apps-script/issues/new)

This is a hard fork of the repo [msukmanowsky/gapi-firebase](https://github.com/msukmanowsky/gapi-firebase). You may wish to contact the author for direct advice. Visit the page.

## Background

If you are trying to use [Google's JavaScript Library](https://developers.google.com/api-client-library/javascript/)
to query Google APIs (e.g. Google Apps Script Executable API), you'll run into an issue whereby
Firebase Auth is strictly intended for AuthN (fetching a user's identity and
not AuthZ (authorizing a user to access specific resources).

The access token that Firebase Auth provides _is valid_ for whatever scopes
a user approved, but Firebase Auth does not provide any means to see the
access token upon, say, token refreshes. This is
[by design](https://github.com/firebase/firebaseui-web/issues/294).

Google's JavaScript Library transparently handles token refreshes but
will also provide access to the updated token via:

```javascript
const auth2 = gapi.auth2.getAuthInstance();
auth2.isSignedIn.listen((isSignedIn) => {
  if (isSignedIn) {
    const currentUser = auth2.currentUser.get();
    const authResponse = currentUser.getAuthResponse(true);
    authResponse.id_token;
    authResponse.access_token;
  }
});
```

These same credentials can also be used to authorize a user to Firebase!

```javascript
const credential = firebase.auth.GoogleAuthProvider.credential(
  authResponse.id_token,
  authResponse.access_token
);
firebase.auth().signInWithCredential(credential);
```

There are some additional concerns to keep in mind like signing out of both
`gapi` and `firebase`:

```javascript
const auth2 = gapi.auth2.getAuthInstance();
auth2.signOut().then(() => {
  return firebase.auth().signOut();
});
```

Now you have the best of both worlds, the ability to make requests to any
Google API via `gapi` and an authenticated `firebase` client to communicate
with firebase APIs.

## Running this example

1. Clone this repo locally.
1. Build an Apps Script project from `./apps-script-project`
1. [Sign up](https://firebase.google.com) for a Firebase app.
1. [Enable](https://console.cloud.google.com/apis/dashboard) the "Google Drive API", "Script API", "Sheets API" for Firebase project.
1. Find the [OAuth Client ID](https://console.cloud.google.com/apis/credentials) firebase auto-created on setup and ensure your server's origin is listed in "Authorised JavaScript origins" (should be something like `http://localhost:8000`, but depends on your server config).
1. Add the `init.js` file to public/js which should content two constant

```js
const FIREBASE_CONFIG = {
  projectId: '...',
  appId: '...',
  databaseURL: '...',
  storageBucket: '...',
  locationId: '...',
  apiKey: '...',
  authDomain: '...',
  messagingSenderId: '...',
};
const CLIENT_ID = '...';
```

1. Run your webserver `$> npx firebase serve`
1. Open up your browser's dev console and check logging messages.
1. Click login!
