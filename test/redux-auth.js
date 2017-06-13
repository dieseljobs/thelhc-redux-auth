import expect from 'expect'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { observe } from 'redux-observers'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { createSessionListener } from 'lhc-js-lib'
import { createInterceptors, reducer, checkForUser, observers } from '../src'
import { setSpoofUser } from '../src/actions'

describe('lhc-redux-auth integration', () => {
  const store = createStore(
    combineReducers({
      auth: reducer
    }),
    applyMiddleware(thunk)
  )
  observe( store, [ ...observers ] )
  createInterceptors( axios, store, {
    spoofBlacklist: [ '/api/admin/*' ]
  })
  createSessionListener()

  const userFixture = {
    id: 1,
    name: 'Aaron Kaz',
    token: 'freshTokenFromUser'
  }
  const spoofUserFixture = {
    id: 2,
    name: 'Bobby Brown',
    token: 'storedSpoofUserToken'
  }



  it('should initialize user in store', () => {
    localStorage.setItem( '@@auth/userToken', 'localStoredToken' )
    const mock = new MockAdapter( axios )
    mock.onGet('/api/account/user').reply(200, userFixture)
    store.dispatch( checkForUser( axios, '/auth/token', '/api/account/user' ))
      .then( ( result ) => {
        expect( store.getState() ).toEqual({
          auth: {
            isAuthenticated: true,
            isChecking: false,
            token: 'freshTokenFromUser',
            expireFlag: false,
            user: userFixture
          }
        })
      })
      .catch( (err) => {
        console.log(err)
      })
  })

  it('should pass user token to interceptors', () => {
    const mock = new MockAdapter( axios )
    mock.onGet('/api/foobar').reply(200, 'Ok')
    axios.get('/api/foobar')
      .then( ( response ) => {
        const { config: { headers: { Authorization } } } = response
        expect( Authorization ).toEqual( 'Bearer freshTokenFromUser' )
      })
      .catch( err => console.log(err))
  })

  it('should observe token changes in store', () => {
    expect( localStorage.getItem( '@@auth/userToken' ) ).toEqual( 'freshTokenFromUser' )
  })

  it('should observe user changes in store', () => {
    expect( sessionStorage.getItem( '@@auth/user' ) ).toEqual( JSON.stringify( userFixture ) )
  })

  it('should observe spoofUser changes in store', () => {
    store.dispatch( setSpoofUser( spoofUserFixture ) )
    expect( sessionStorage.getItem( '@@auth/spoofUser' ) ).toEqual( JSON.stringify( spoofUserFixture ) )
  })

  it('should pass spoofUser token to interceptors', () => {
    const mock = new MockAdapter( axios )
    mock.onGet('/api/foobar').reply(200, 'Ok')
    axios.get('/api/foobar')
      .then( ( response ) => {
        const { config: { headers: { Authorization } } } = response
        expect( Authorization ).toEqual( 'Bearer storedSpoofUserToken' )
      })
      .catch( err => console.log(err))
  })

  it('should obey spoofBlacklist directive in interceptors', () => {
    const mock = new MockAdapter( axios )
    mock.onGet('/api/admin/foobar').reply(200, 'Ok')
    axios.get('/api/admin/foobar')
      .then( ( response ) => {
        const { config: { headers: { Authorization } } } = response
        expect( Authorization ).toEqual( 'Bearer freshTokenFromUser' )
      })
      .catch( err => console.log(err))
  })

  it('should logout spoofuser without affecting user', () => {
    store.dispatch( setSpoofUser( '' ) )
    expect( store.getState().auth.spoofUser ).toEqual( '' )
  })

  it('should observe spoof user removal in store', () => {
    expect( sessionStorage.getItem( '@@auth/spoofUser' ) ).toEqual( null )
  })

  it('should catch auth error in interceptor', () => {
    const mock = new MockAdapter( axios )
    mock.onGet('/api/foobar').reply(403, ['token_expired'])
    axios.get('/api/foobar')
      .then( ( response ) => {
      })
      .catch( err => {
        expect( store.getState() ).toEqual({
          auth: {
            isAuthenticated: false,
            isChecking: false,
            token: '',
            expireFlag: false,
            user: {},
            spoofUser: ''
          }
        })
      })
  })

  it('should observe token removal in store', () => {
    expect( localStorage.getItem( '@@auth/userToken' ) ).toEqual( null )
  })

  it('should observe user removal in store', () => {
    expect( sessionStorage.getItem( '@@auth/user' ) ).toEqual( null )
  })

})
