import expect from 'expect'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { observe } from 'redux-observers'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { createSessionListener } from 'lhc-js-lib'
import { reducer, appInitializer, observers, setToken } from '../src'
import { STORED_TOKEN } from '../src/constants'

describe('observers', () => {
  const userJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxNzkxMjIsImV4cCI6MTUwNjE4MjcyMiwibmJmIjoxNTA2MTc5MTIyLCJqdGkiOiJoT2tENjR3WWhZbWxocXc0Iiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn19.OOqWuhqX2trxhOVTYzoQRHTQI33D6m-IEjyNcBcc3lg"

  const userJwtNoRem = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODEzODMsImV4cCI6MTUwNjE4NDk4MywibmJmIjoxNTA2MTgxMzgzLCJqdGkiOiI5YVpDZndmWXBpRDVEUXVlIiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn0sInJlbSI6ZmFsc2V9.ISA3cTw5FBJk8Pik00pin69Le_BOepDpzI1ZC50hZk4"

  let store;
  beforeEach(() => {
    store = createStore(
      combineReducers({
        auth: reducer
      }),
      applyMiddleware(thunk)
    )
    observe( store, [ ...observers ] )
    createSessionListener()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })


  it('should observe token changes in store for remember-able token', () => {
    store.dispatch( setToken( userJwt ) )
    expect( localStorage.getItem( STORED_TOKEN ) ).toEqual( userJwt )
  })

  it('should observe token changes in store for non-remember-able token', () => {
    store.dispatch( setToken( userJwtNoRem ) )
    expect( sessionStorage.getItem( STORED_TOKEN ) ).toEqual( userJwtNoRem )
  })
})
