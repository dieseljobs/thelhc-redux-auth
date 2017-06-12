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


