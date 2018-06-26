import expect from 'expect'
import reducer from '../src/reducer'
import { setAsyncInProgress,
         setToken,
         setUser,
         setSpoofUser } from '../src/actions'
import { INITIAL_STATE } from '../src/constants'

describe('reducer', () => {

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  const userJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAiLCJpYXQiOjE1MDYxNzkxMjIsImV4cCI6MTUwNjE4MjcyMiwibmJmIjoxNTA2MTc5MTIyLCJqdGkiOiJoT2tENjR3WWhZbWxocXc0Iiwic3ViIjoxLCJhdWQiOjEsInVzciI6eyJpZCI6MSwibmFtZSI6IkFhcm9uIn19.OOqWuhqX2trxhOVTYzoQRHTQI33D6m-IEjyNcBcc3lg"

  it('should handle initial state', () => {
    expect( reducer( undefined, { type: '@@INIT' } ) ).toEqual(INITIAL_STATE)
  })

  it('should handle SET_ASYNC_IN_PROGRESS', () => {
    const expected = Object.assign({}, INITIAL_STATE, { asyncInProgress: true })
    expect( reducer( undefined, setAsyncInProgress( true ) ) ).toEqual(expected)
  })

  it('should handle SET_TOKEN', () => {
    const expected = Object.assign({}, INITIAL_STATE, { token: userJwt })
    expect( reducer( undefined, setToken( userJwt ) ) ).toEqual(expected)
  })

  it('should handle SET_USER', () => {
    const user = {
      id: 1,
      fname: 'Aaron',
      lname: 'Kaz'
    }
    const expected = Object.assign({}, INITIAL_STATE, { user })
    expect( reducer( undefined, setUser( user ) ) ).toEqual(expected)
  })

  it('should handle SET_SPOOF_USER', () => {
    const spoofUser = {
      id: 2,
      fname: 'Spoof',
      lname: 'Dude'
    }
    const expected = Object.assign({}, INITIAL_STATE, { spoofUser })
    expect( reducer( undefined, setSpoofUser( spoofUser ) ) ).toEqual(expected)
  })

})
