import { STORED_TOKEN } from '../src/constants'
import { getTokenFromStorage, storeToken, removeTokenFromStorage, isTokenRefreshable } from '../src/utils'
import config from '../src/config'

describe('utils', () => {

  const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM"
  const userJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxNzkxMjIsImV4cCI6MTUwNjE4MjcyMiwibmJmIjoxNTA2MTc5MTIyLCJqdGkiOiJoT2tENjR3WWhZbWxocXc0Iiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn19.OOqWuhqX2trxhOVTYzoQRHTQI33D6m-IEjyNcBcc3lg"
  const userJwtNoRem = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODEzODMsImV4cCI6MTUwNjE4NDk4MywibmJmIjoxNTA2MTgxMzgzLCJqdGkiOiI5YVpDZndmWXBpRDVEUXVlIiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn0sInJlbSI6ZmFsc2V9.ISA3cTw5FBJk8Pik00pin69Le_BOepDpzI1ZC50hZk4"

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    // reset config
    config.getTokenFromStorage = null
    config.setTokenToStorage = null
    config.removeTokenFromStorage = null
  })

  it('handles storeToken', () => {
    storeToken( userJwt )
    expect( localStorage.getItem( STORED_TOKEN ) ).toEqual( userJwt )
  })

  it('handles storeToken for non-rememberable', () => {
    storeToken( userJwtNoRem )
    expect( sessionStorage.getItem( STORED_TOKEN ) ).toEqual( userJwtNoRem )
  })

  it('should store token with custom config', () => {
    config.setTokenToStorage = ( token ) => {
      return `CUSTOM STORAGE ${token}`
    }
    expect(storeToken( userJwt )).toEqual(`CUSTOM STORAGE ${userJwt}`)
  })

  it('handles getTokenFromStorage', () => {
    localStorage.setItem( STORED_TOKEN, jwt )
    expect(getTokenFromStorage()).toEqual( jwt )
  })

  it('handles getTokenFromStorage with sessionStorage', () => {
    sessionStorage.setItem( STORED_TOKEN, userJwt )
    expect(getTokenFromStorage()).toEqual( userJwt )
  })

  it('should get stored token with custom config', () => {
    config.getTokenFromStorage = ( token ) => {
      return `CUSTOM STORAGE`
    }
    expect(getTokenFromStorage()).toEqual(`CUSTOM STORAGE`)
  })

  it('handles removeTokenFromStorage', () => {
    localStorage.setItem( STORED_TOKEN, jwt )
    removeTokenFromStorage()
    expect( localStorage.getItem( STORED_TOKEN ) ).toEqual( null )
  })

  it('handles removeTokenFromStorage with sessionStorage', () => {
    sessionStorage.setItem( STORED_TOKEN, jwt )
    removeTokenFromStorage()
    expect( sessionStorage.getItem( STORED_TOKEN ) ).toEqual( null )
  })

  it('should remove stored token with custom config', () => {
    config.removeTokenFromStorage = ( token ) => {
      return `REMOVE CUSTOM STORAGE`
    }
    expect(removeTokenFromStorage()).toEqual(`REMOVE CUSTOM STORAGE`)
  })

  it('handles isTokenRefreshable', () => {
    expect(isTokenRefreshable( jwt )).toEqual( false )
  })

})
