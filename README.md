# thelhc-redux-auth
TheLHC JWT user authorization integration for redux

## Installation

```js
npm install --save thelhc-redux-auth
```

1. redux-auth uses thunk actions, you'll need to ensure `redux-thunk` middleware is applied to the store:

    ```js
    import { createStore, applyMiddleware } from 'redux'
    import thunkMiddleware from 'redux-thunk'
    const store = createStore(
      reducer,
      applyMiddleware(
        thunkMiddleware
      )
    )
    ```

2. Install the reducer into the `auth` path of your `combineReducers` object:

    ```js
    import { combineReducers } from 'redux'
    import { reducer as authReducer } from 'thelhc-redux-auth'

    const reducer = combineReducers({
      auth: authReducer,
      ...reducers // your other reducers
    })
    ```

4. redux-auth uses `redux-observers` to sync tokens with the HTML5 Storage Api.  Ensure redux-observers is installed and registers redux-auth observers with the store:

    ```js
    import { observe } from 'redux-observers'
    import { observers as authObservers } from 'thelhc-redux-auth'

    observe(
      store,                    // your redux store object
      [ ...authObservers ]      // an array of observers, including auth observers
    )
    ```


## Usage
redux-auth integrates into a redux app via a single initializer function (`appInitializer`).  This initializer looks for a stored Json Web Token or makes a request to retrieve a token from a specified api destination in order to secure access for future asynchronous requests to a protected Json API service.  Once an access token is attained, it is dispatched to the store to be parsed and stored as an authenticated session.  Http client interceptors are then configured to automatically listen for new or refreshed tokens from subsequent requests which cascade to the store as necessary.  `appInitializer` ultimately terminates in a promise for the requesting app to handle success and failure callbacks.  

```js
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { observe } from 'redux-observers'
import { Provider } from 'react-redux'
import { reducer as authReducer,
         observers as authObservers,
         appInitializer } from 'thelhc-redux-auth'

// create store with auth reducer and thunkMiddleware
const store = createStore(
    combineReducers({
      auth: authReducer
    }),
    compose(
      applyMiddleware( thunkMiddleware )
    )
)

// observe auth observers
observe( store, [ ...authObservers ] )

appInitializer({
  client: axios,                          // http client to use
  store: store,                           // redux store
  url: '/api/access',                     // url to request token
  clientId: 'a9b8c7d6e5f4g3h2i1',         // unique Api key to post to url
  afterSessionSuccess: ( token ) => {
    return ( dispatch, getState ) => {
      // callback thunk action after session is constructed
    }
  },
  onSessionReject: () => {
    return ( dispatch, getState ) => {
      // callback when token is rejected (invalid, expired, or blacklisted)
    }
  }
})
  .then( ( result ) => {
    // mount a react redux app
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById( 'app' )
    )
  })
  .catch( error => {
    // catch token request response error
  })

```


## API


#### `appInitializer([config])`

Root-level initiation for app authentication session.

Available `config` options:

  - `client` *(Object)* **required**

    The HTTP client (Axios) instance used to make async requests.

    Must be passed explicitly for redux-auth to attach interceptors.

  - `store` *(Object)* **required**

    The redux store to dispatch actions to

  - `url` *(String)* **required**

    URL for retrieving Json Web Token for public access when no session present.  

  - `clientId` *(String)* **required**

    Unique api key to authenticate request to access URL

  - `afterSessionSuccess` *(Function)*

    Redux thunk action to after session has been successfully saved to store

  - `onSessionReject` *(Function)*

    Redux thunk action to call upon rejected api request


_This should be called only once at the initialization of the application prior to any other async requests_

#### `createIsAdminSelector([computationBlock])`

Creates a selector for determining if user has admin privileges.

  - `computationBlock(user) => boolean result` *(Function)*

    An anonymous function to determine if passed `user` argument has admin priveleges.

    Must return boolean value.

    ```js
    import { createIsAdminSelector } from 'thelhc-redux-auth'
    const mapStateToProps = ( state ) => ({
        isAdmin: createIsAdminSelector( user => user.level >= 7 )( state )
    })
    ```

#### `isSpoof([state])`

Selector to determine if authenticated user is spoofed.

  - `state` *(Object)*

    Redux state object

#### `isAuthenticated([state])`

Selector to determine if user authenticated.

  - `state` *(Object)*

    Redux state object

#### `isAsyncInProgress([state])`

Selector to determine if async request is in progress.

  - `state` *(Object)*

    Redux state object

#### `selectAbsoluteUser([state])`

Select the authenticated user, ignoring spoofed user (if present)

  - `state` *(Object)*

    Redux state object

#### `selectUser([state])`

Selects the authenticated user, defaulting to spoofUser first, the falling back to normal user or null if not authenticated

  - `state` *(Object)*

    Redux state object
