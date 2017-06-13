import expect from 'expect'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { setUserAuth, checkForUser, resetAuth } from '../src/actions'
//import createReducer from '../src/reducer'

describe('thunk actions', () => {


  const middlewares = [ thunk ]

  let store;
  beforeEach(() => {
    store = configureMockStore(middlewares)()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('should handle setUserAuth', () => {
    const user = {
      id: 1,
      fname: 'Aaron',
      lname: 'Kaz',
      token: 'abc123def456'
    }
    store.dispatch( setUserAuth( user ) )
    expect( store.getActions() ).toEqual([
      {
        type: '@@auth/SET_TOKEN',
        token: 'abc123def456'
      },
      {
        type: '@@auth/SET_USER',
        user: user
      },
      {
        type: '@@auth/SET_AUTHENTICATED',
        val: true
      }
    ])
  })

  it('should handle checkForUser with token in storage and user in session', () => {
    const user= {
      id: 1,
      name: 'Aaron Kaz',
      token: 'storedUserTokenabc123def456'
    }
    localStorage.setItem( '@@auth/userToken', 'localTokenabc123def456' )
    sessionStorage.setItem( '@@auth/user', JSON.stringify(user) )

    store.dispatch( checkForUser( axios, '/auth/token', '/api/account/user' ) )
      .then( () => {
        expect( store.getActions() ).toEqual([
          {
            type: '@@auth/SET_IS_CHECKING',
            val: true
          },
          {
            type: '@@auth/SET_TOKEN',
            token: 'localTokenabc123def456'
          },
          {
            type: '@@auth/SET_USER',
            user: user
          },
          {
            type: '@@auth/SET_AUTHENTICATED',
            val: true
          },
          {
            type: '@@auth/SET_IS_CHECKING',
            val: false
          }
        ])
      })
      .catch( err => console.log(err))
  })

  it('should handle checkForUser with token in storage and no user in session', () => {
    localStorage.setItem( '@@auth/userToken', 'localTokenabc123def456' )
    const user = {
      id: 1,
      name: 'Aaron Kaz',
      token: 'storedUserTokenabc123def456'
    }
    const mock = new MockAdapter( axios )
    mock.onGet('/api/account/user').reply(200, user)

    store.dispatch( checkForUser( axios, '/auth/token', '/api/account/user' ) )
      .then( () => {
        expect( store.getActions() ).toEqual([
          {
            type: '@@auth/SET_IS_CHECKING',
            val: true
          },
          {
            type: '@@auth/SET_TOKEN',
            token: 'storedUserTokenabc123def456'
          },
          {
            type: '@@auth/SET_USER',
            user: user
          },
          {
            type: '@@auth/SET_AUTHENTICATED',
            val: true
          },
          {
            type: '@@auth/SET_IS_CHECKING',
            val: false
          }
        ])
      })
      .catch( err => console.log(err))
  })

  it('should handle checkForUser with no token in storage, no user in session, but has backend session', () => {
    const user = {
      id: 1,
      name: 'Aaron Kaz',
      token: 'storedUserTokenabc123def456'
    }
    const mock = new MockAdapter( axios )
    mock.onGet('/auth/token').reply(200, {token: 'tokenFromAPIRequest'})
    mock.onGet('/api/account/user').reply(200, user)

    store.dispatch( checkForUser( axios, '/auth/token', '/api/account/user' ) )
      .then( () => {
        expect( store.getActions() ).toEqual([
          {
            type: '@@auth/SET_IS_CHECKING',
            val: true
          },
          {
            type: '@@auth/SET_TOKEN',
            token: 'storedUserTokenabc123def456' // since we retrieved the user, we'll expect that
          },
          {
            type: '@@auth/SET_USER',
            user: user
          },
          {
            type: '@@auth/SET_AUTHENTICATED',
            val: true
          },
          {
            type: '@@auth/SET_IS_CHECKING',
            val: false
          }
        ])
      })
      .catch( err => console.log(err))
  })

  it('should handle checkForUser with no token in storage, no user in session, and no backend session', () => {
    const user = {
      id: 1,
      name: 'Aaron Kaz',
      token: 'storedUserTokenabc123def456'
    }
    const mock = new MockAdapter( axios )
    mock.onGet('/auth/token').reply(200, null)
    mock.onGet('/api/account/user').reply(200, user)

    store.dispatch( checkForUser( axios, '/auth/token', '/api/account/user' ) )
      .then( () => {
        expect( store.getActions() ).toEqual([
          {
            type: '@@auth/SET_IS_CHECKING',
            val: true
          },
          {
            type: '@@auth/SET_IS_CHECKING',
            val: false
          }
        ])
      })
      .catch( err => console.log(err))
  })

  it('should handle checkForUser with token in storage, user in session, and spoof user', () => {
    const user = {
      id: 1,
      name: 'Aaron Kaz',
      token: 'storedUserTokenabc123def456'
    }
    const spoofUser = {
      id: 2,
      name: 'Bobby Brown',
      token: 'storedSpoofUserToken'
    }
    localStorage.setItem( '@@auth/userToken', 'localTokenabc123def456' )
    sessionStorage.setItem( '@@auth/user', JSON.stringify(user) )
    sessionStorage.setItem( '@@auth/spoofUser', JSON.stringify(spoofUser) )

    store.dispatch( checkForUser( axios, '/auth/token', '/api/account/user' ) )
      .then( () => {
        expect( store.getActions() ).toEqual([
          {
            type: '@@auth/SET_IS_CHECKING',
            val: true
          },
          {
            type: '@@auth/SET_SPOOF_USER',
            user: spoofUser
          },
          {
            type: '@@auth/SET_TOKEN',
            token: 'localTokenabc123def456'
          },
          {
            type: '@@auth/SET_USER',
            user: user
          },
          {
            type: '@@auth/SET_AUTHENTICATED',
            val: true
          },
          {
            type: '@@auth/SET_IS_CHECKING',
            val: false
          }
        ])
      })
      .catch( err => console.log(err))
  })

})
