import expect from 'expect'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import * as types from '../src/actionTypes'
import appInitializer from '../src/appInitializer'

describe('appInitializer', () => {

  const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM"

  const userJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxNzkxMjIsImV4cCI6MTUwNjE4MjcyMiwibmJmIjoxNTA2MTc5MTIyLCJqdGkiOiJoT2tENjR3WWhZbWxocXc0Iiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn19.OOqWuhqX2trxhOVTYzoQRHTQI33D6m-IEjyNcBcc3lg"

  const spoofUserJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODA0NTIsImV4cCI6MTUwNjE4NDA1MiwibmJmIjoxNTA2MTgwNDUyLCJqdGkiOiIweDhwaDVaTXl4bDRxYzNWIiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn0sInNwb29mIjp7ImlkIjoyLCJuYW1lIjoiSmltIEJvYiJ9fQ.jGNKy-eH5quvpx7OgSOj1b9Sz5qoI_p-bbEvJOdCX8c"

  const userFixture = {
    id: 1,
    name: 'Aaron',
  }

  const spoofUserFixture = {
    id: 2,
    name: 'Jim Bob'
  }

  const middlewares = [ thunk ]

  let store;
  beforeEach(() => {
    store = configureMockStore(middlewares)({auth: {}})
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('should handle token for unauthenticated user', () => {
    const mock = new MockAdapter( axios )
    mock.onPost( 'api/auth/access' ).reply(201, {
      token: jwt
    })

    appInitializer({
      client: axios,
      store: store,
      url: '/api/auth/access',
      clientId: 1234567890
    })
      .then( ( result ) => {
        expect( store.getActions() ).toEqual( [
          { type: types.SET_TOKEN,
            token: jwt }
        ])
      })
      .catch( error => {
        console.log('got error', error )
      })
  })

  it('should handle token for Authenticated User', () => {
    const mock = new MockAdapter( axios )
    mock.onPost( 'api/auth/access' ).reply(201, {
      token: userJwt
    })

    appInitializer({
      client: axios,
      store: store,
      url: '/api/auth/access',
      clientId: 1234567890
    })
      .then( ( result ) => {
        expect( store.getActions() ).toEqual( [
          { type: types.SET_TOKEN,
            token: userJwt },
          { type: types.SET_USER, user: userFixture }
        ])
      })
      .catch( error => {
        console.log('got error', error )
      })
  })

  it('should handle token for spoofed user', () => {
    const mock = new MockAdapter( axios )
    mock.onPost( 'api/auth/access' ).reply(201, {
      token: spoofUserJwt
    })

    appInitializer({
      client: axios,
      store: store,
      url: '/api/auth/access',
      clientId: 1234567890
    })
      .then( ( result ) => {
        expect( store.getActions() ).toEqual( [
          { type: types.SET_TOKEN,
            token: spoofUserJwt },
          { type: types.SET_USER, user: userFixture },
          { type: types.SET_SPOOF_USER, user: spoofUserFixture }
        ])
      })
      .catch( error => {
        console.log('got error', error )
      })
  })


})
