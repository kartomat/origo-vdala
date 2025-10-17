
# OIDC-plugin to Geoserver

1. In index.html add the adress to geoserver and set updateSessionOnRefresh to true
```js
    Oidc.createOidcAuth(
        {
          	externalSessionUrl: '/geoserver',
          	updateSessionOnRefresh: true,
          	sessionRefreshTimeout: 8,
            ...
            ...
        }
    )
```
2. In oidc.js there's a function responsible for sending a fresh access_token to geoserver any time the session refreshes
```js
 async function refreshExternalSession() {
    try {
      const user = getUser();
      if (!user.authenticated) {
        return;
      }
      const response = await fetch(`${options.externalSessionUrl}?access_token=${user.access_token}`);
      if (response.ok) {
        console.info('Successfully refreshed external session');
      } else {
        throw 'External service did not respond with OK';
      }
    } catch (e) {
      console.error(e);
    }
  }
```
3. Skapa ett Verifieringsfilter i Geoserver med dina OIDC-uppgifter - fyll på detta senare.