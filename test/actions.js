import expect from 'expect'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { INITIAL_STATE, STORED_TOKEN } from '../src/constants'
import { setToken, retrieveToken, resolveToken } from '../src/actions'

describe('actions', () => {
  
  const tokenUrl = '/api/auth/access'
  const tokenParams = {
    clientId: 1234567890
  }

  const middlewares = [ thunk ]
  let store
  beforeEach(() => {
    store = configureMockStore(middlewares)({
      auth: INITIAL_STATE
    })
  })
  
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  const userJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxNzkxMjIsImV4cCI6MTUwNjE4MjcyMiwibmJmIjoxNTA2MTc5MTIyLCJqdGkiOiJoT2tENjR3WWhZbWxocXc0Iiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn19.OOqWuhqX2trxhOVTYzoQRHTQI33D6m-IEjyNcBcc3lg"
  const userJwtNoRem = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODEzODMsImV4cCI6MTUwNjE4NDk4MywibmJmIjoxNTA2MTgxMzgzLCJqdGkiOiI5YVpDZndmWXBpRDVEUXVlIiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn0sInJlbSI6ZmFsc2V9.ISA3cTw5FBJk8Pik00pin69Le_BOepDpzI1ZC50hZk4"

  it('should observe token changes in store for remember-able token', () => {
    store.dispatch( setToken( userJwt ) )
    expect( localStorage.getItem( STORED_TOKEN ) ).toEqual( userJwt )
  })

  it('should observe token changes in store for non-remember-able token', () => {
    store.dispatch( setToken( userJwtNoRem ) )
    expect( sessionStorage.getItem( STORED_TOKEN ) ).toEqual( userJwtNoRem )
  })
 
  it('should handle retrieveToken httpClient rejection', () => {
    store.dispatch( retrieveToken() )
      .then( ( result ) => {
      })
      .catch( err => {
        expect( err ).toEqual( "Error: undefined httpClient argument in 'retrieveToken'" )
      })
  })
  
  it('should handle retrieveToken tokenUrl rejection', () => {
    store.dispatch( retrieveToken( axios ) )
      .then( ( result ) => {
      })
      .catch( err => {
        expect( err ).toEqual( "Error: undefined tokenUrl argument in 'retrieveToken'" )
      })
  })
  
  it('should handle retrieveToken request rejection', () => {
    const mock = new MockAdapter( axios )
    const errorData = {
      "status": 422,
      "errors": {
        "client_id": [
          "The selected client id is invalid."
        ]
      }
    }
    mock.onPost( tokenUrl ).reply(422, errorData)
    
    store.dispatch( retrieveToken( axios, tokenUrl ) )
      .then( ( result ) => {
      })
      .catch( err => {
        expect( err.response.data ).toEqual( errorData )
      })
  })
  
  it('should handle retrieveToken request success', () => {
    const mock = new MockAdapter( axios )
    const successData = {
      "status": 201,
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM"
    }
    mock.onPost( tokenUrl ).reply(201, successData)
    
    store.dispatch( retrieveToken( axios, tokenUrl, tokenParams ) )
      .then( ( result ) => {
        expect( result ).toEqual( successData.token )
      })
      .catch( err => {
      })
  })
  
  it('should handle retrieveToken from storage', () => {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM"
    localStorage.setItem( STORED_TOKEN, token )
    store.dispatch( retrieveToken( axios, tokenUrl, tokenParams ) )
      .then( ( result ) => {
        expect( result ).toEqual( token )
      })
      .catch( err => {
      })
  })
  
  it('should handle resolveToken rejection', () => {
    const mock = new MockAdapter( axios )
    const errorData = {
      "status": 422,
      "errors": {
        "client_id": [
          "The selected client id is invalid."
        ]
      }
    }
    mock.onPost( tokenUrl ).reply(422, errorData)
    
    store.dispatch( resolveToken( axios, tokenUrl ) )
      .then( ( result ) => {
        expect(store.getActions()).toEqual([ 
          { type: '@@auth/SET_ASYNC_IN_PROGRESS', val: true },
          { type: '@@auth/SET_ASYNC_IN_PROGRESS', val: false } 
        ])
      })
      .catch( err => console.log(err))
  })
  
  it('should handle resolveToken success', () => {
    const mock = new MockAdapter( axios )
    const successData = {
      "status": 201,
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM"
    }
    mock.onPost( tokenUrl ).reply(201, successData)
    
    store.dispatch( resolveToken( axios, tokenUrl, tokenParams ) )
      .then( ( result ) => {
        expect(store.getActions()).toEqual([ 
          { type: '@@auth/SET_ASYNC_IN_PROGRESS', val: true },
          { type: '@@auth/SET_TOKEN',
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM' },
          { type: '@@auth/SET_ASYNC_IN_PROGRESS', val: false } 
        ])
      })
      .catch( err => console.log(err))
  })
  
  it('should handle resolveToken success with callback', () => {
    const mock = new MockAdapter( axios )
    const successData = {
      "status": 201,
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM"
    }
    mock.onPost( tokenUrl ).reply(201, successData)
    
    const callbacks = {
      afterSessionSuccess: () => ({
        type: 'AFTER_TOKEN_SUCESS'
      })
    }
    
    store.dispatch( resolveToken( axios, tokenUrl, tokenParams, callbacks ) )
      .then( ( result ) => {
        expect(store.getActions()).toEqual([ 
          { type: '@@auth/SET_ASYNC_IN_PROGRESS', val: true },
          { type: '@@auth/SET_TOKEN',
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM' },
          { type: 'AFTER_TOKEN_SUCESS' },
          { type: '@@auth/SET_ASYNC_IN_PROGRESS', val: false } 
        ])
      })
      .catch( err => console.log(err))
  })

})