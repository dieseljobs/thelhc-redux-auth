# thelhc-redux-auth
TheLHC JWT user authorization integration for redux

## Install

```js
npm install --save thelhc-redux-auth
```

## Usage

1. First you'll need to ensure `redux-thunk` middleware is applied to store already:

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
    
3. Initialize the user session with `checkForUser` in your root component:

    ```js
    import React from 'react'
    import { connect } from 'react-redux'
    import axios from 'axios' // we require the axios http client object we want to attach interceptors on
    import { checkForUser } from 'thelhc-redux-auth'
    
    class Root extends React.Component {
      componentWillMount(){
        this.props.dispatch( checkForUser( 
          axios,                  // http client object
          '/auth/token',          // your api endpoint to get a token if user session open in backend
          '/api/account/user'     // your api endpoint to fetch/signin user with jwt token
         ) )
      }
    }
    ```
    
4. Setup interceptors for redux-auth to attach JWT tokens:

    ```js
    import { createInterceptors } from 'thelhc-redux-auth'
    
    createInterceptors( 
      axios,                                  // axios http client object
      store,                                  // your redux store object 
      {                                       // options 
        spoofBlacklist: [ '/api/admin/*' ]      // an array of url path expressions to block from user spoofing
      }
    )
    ```
4. Setup observers to keep local storage synced to store:

    ```js
    import { observe } from 'redux-observers'
    import { observers as authObservers } from 'thelhc-redux-auth'
    
    observe( 
      store,                    // your redux store object 
      [ ...authObservers ]      // an array of observers, including auth observers
    )
    ```
    
## API


#### `checkForUser([client], [tokenEndpoint], [userEndpoint])`

Creates an observer.

  - `client` *(Object)*

    The HTTP client (Axios) instance used to make async requests.

    Must be passed explicitly for redux-auth to attach interceptors.

  - `tokenEndpoint` *(String)*

    URL for retrieving valid JWT tokens for users authenticated in backend.  
    
    Expects response with token string if authenticated, or null/blank if not-authenticated.

  - `userEndpoint` *(String)*

    URL for retrieving user object with valid JWT token.  
    
    Expects response with JSON representation of user model.

_This should be called only once at the root of the application after the redux store has been initialized, ideally in a high-level root component_

#### `createInterceptors([client], [store])`

Creates an observer.

  - `client` *(Object)*

    The HTTP client (Axios) instance used to make async requests.

    Must be passed explicitly for redux-auth to attach interceptors.

  - `store` *(Object)*

    Redux store instance.

_This should be called only once at the root of the application before the React DOM is mounted/rendered_

#### `createIsAdminSelector([computationBlock])`

Creates an observer.

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

#### `resetAuth([expireFlag = false])`

Selector to determine if authenticated user is spoofed.

  - `expireFlag` *(Boolean)*

    When true, redux-auth will signal an expired flag to indicate the user session has been closed due to inactivity or rejected jwt.
    
#### `selectAbsoluteUser([state])`

Select the authenticated user, ignoring spoofed user (if present)

  - `state` *(Object)*

    Redux state object

#### `selectUser([state])`

Selects the authenticated user, defaulting to spoofUser first, the falling back to normal user or null if not authenticated

  - `state` *(Object)*

    Redux state object

#### `setUserAuth([user], [token = null])`

Dispatch action to set authenticated user in store

  - `user` *(Object)*

    Authenticated user object.
    
  - `token` *(String)*

    Pass a new JWT token to store.  (defaults to `token` key of user object)
    
#### `spoofUser([client], [spoofUserEndpoint], [params])`

Dispatch action to set authenticated user in store

  - `client` *(Object)*

    The HTTP client (Axios) instance used to make async requests.

    Must be passed explicitly for redux-auth to attach interceptors.

  - `spoofUserEndpoint` *(String)*

    URL to make POST request for a spoof user.  
    
    Expects JSON representation of spoofed user model.

  - `params` *(Object)*

    Parameters to send to [spoofUserEndpoint] API.  
