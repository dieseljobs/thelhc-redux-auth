import expect from 'expect'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { setUserAuth, checkForUser, resetAuth, spoofUser } from '../src/actions'
//import createReducer from '../src/reducer'

describe('thunk actions', () => {

  const userFixture = {
    id: 1,
    name: 'Aaron Kaz',
    token: 'storedUserTokenabc123def456'
  }
  const spoofUserFixture = {
    id: 2,
    name: 'Bobby Brown',
    token: 'storedSpoofUserToken'
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

  it('should handle setUserAuth', () => {
    store.dispatch( setUserAuth( userFixture ) )
    expect( store.getActions() ).toEqual([
      {
        type: '@@auth/SET_TOKEN',
        token: 'storedUserTokenabc123def456'
      },
      {
        type: '@@auth/SET_USER',
        user: userFixture
      },
      {
        type: '@@auth/SET_AUTHENTICATED',
        val: true
      }
    ])
  })

  it('should handle checkForUser with token in storage and user in session', () => {
    localStorage.setItem( '@@auth/userToken', 'localTokenabc123def456' )
    sessionStorage.setItem( '@@auth/user', JSON.stringify(userFixture) )

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
            user: userFixture
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
    const mock = new MockAdapter( axios )
    mock.onGet('/api/account/user').reply(200, userFixture)

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
            user: userFixture
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
    const mock = new MockAdapter( axios )
    mock.onGet('/auth/token').reply(200, {token: 'tokenFromAPIRequest'})
    mock.onGet('/api/account/user').reply(200, userFixture)

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
            user: userFixture
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
    const mock = new MockAdapter( axios )
    mock.onGet('/auth/token').reply(200, null)

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
    localStorage.setItem( '@@auth/userToken', 'localTokenabc123def456' )
    sessionStorage.setItem( '@@auth/user', JSON.stringify(userFixture) )
    sessionStorage.setItem( '@@auth/spoofUser', JSON.stringify(spoofUserFixture) )

    store.dispatch( checkForUser( axios, '/auth/token', '/api/account/user' ) )
      .then( () => {
        expect( store.getActions() ).toEqual([
          {
            type: '@@auth/SET_IS_CHECKING',
            val: true
          },
          {
            type: '@@auth/SET_SPOOF_USER',
            user: spoofUserFixture
          },
          {
            type: '@@auth/SET_TOKEN',
            token: 'localTokenabc123def456'
          },
          {
            type: '@@auth/SET_USER',
            user: userFixture
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

  it('should handle resetAuth without spoof user', () => {
    store.dispatch( resetAuth() )
    expect( store.getActions() ).toEqual([
      {
        type: '@@auth/SET_AUTHENTICATED',
        val: false
      },
      {
        type: '@@auth/SET_USER',
        user: {}
      },
      {
        type: '@@auth/SET_TOKEN',
        token: ''
      },
    ])
  })

  it('should handle resetAuth with spoof user', () => {
    store = configureMockStore(middlewares)({
      auth: {
        spoofUser: {
          name: 'Bobby Brown'
        }
      }
    })
    store.dispatch( resetAuth() )
    expect( store.getActions() ).toEqual([
      {
        type: '@@auth/SET_SPOOF_USER',
        user: ''
      },
    ])
  })

  it('should handle resetAuth with expire flag', () => {
    store.dispatch( resetAuth( true ) )
    expect( store.getActions() ).toEqual([
      {
        type: '@@auth/SET_AUTHENTICATED',
        val: false
      },
      {
        type: '@@auth/SET_USER',
        user: {}
      },
      {
        type: '@@auth/SET_TOKEN',
        token: ''
      },
      {
        type: '@@auth/EXPIRE_FLAG',
        val: true
      },
      {
        type: '@@auth/EXPIRE_FLAG',
        val: false
      },
    ])
  })

  it('should handle spoofUser', () => {
    const mock = new MockAdapter( axios )
    mock.onPost('/auth/spoof-user').reply(200, spoofUserFixture)

    store.dispatch( spoofUser( axios, '/auth/spoof-user', { id: 2 } ) )
      .then( () => {
        expect( store.getActions() ).toEqual([
          {
            type: '@@auth/SET_SPOOF_USER',
            user: spoofUserFixture
          }
        ])
      })
      .catch( err => console.log(err))
  })

})
