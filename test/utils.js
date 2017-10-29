import expect from 'expect'
import { STORED_TOKEN } from '../src/constants'
import { getTokenFromStorage, isTokenRefreshable } from '../src/utils'

describe('utils', () => {

  const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxODAzMjYsImV4cCI6MTUwNjE4MzkyNiwibmJmIjoxNTA2MTgwMzI2LCJqdGkiOiJYVTZrN1o2OWY5ZmtnbTNIIiwic3ViIjowLCJhdWQiOjF9.0KN-V_uQ5oqpZVODROHUBxOHexkW1IfUQpZh9siiAhM"

  const userJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxNzkxMjIsImV4cCI6MTUwNjE4MjcyMiwibmJmIjoxNTA2MTc5MTIyLCJqdGkiOiJoT2tENjR3WWhZbWxocXc0Iiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn19.OOqWuhqX2trxhOVTYzoQRHTQI33D6m-IEjyNcBcc3lg"

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('handles getTokenFromStorage', () => {
    localStorage.setItem( STORED_TOKEN, jwt )
    expect(getTokenFromStorage()).toEqual( jwt )
  })

  it('handles getTokenFromStorage with sessionStorage', () => {
    sessionStorage.setItem( STORED_TOKEN, userJwt )
    expect(getTokenFromStorage()).toEqual( userJwt )
  })

  it('handles isTokenRefreshable', () => {
    expect(isTokenRefreshable( jwt )).toEqual( true )
  })

})
