import expect from 'expect'
import reducer from '../src/reducer'
import { setAsyncInProgress,
         setToken,
         setUser,
         expire,
         setSpoofUser } from '../src/actions'
import { INITIAL_STATE } from '../src/constants'

describe('reducer', () => {

  it('should handle initial state', () => {
    expect( reducer( undefined, { type: '@@INIT' } ) ).toEqual(INITIAL_STATE)
  })

  it('should handle SET_ASYNC_IN_PROGRESS', () => {
    const expected = Object.assign({}, INITIAL_STATE, { asyncInProgress: true })
    expect( reducer( undefined, setAsyncInProgress( true ) ) ).toEqual(expected)
  })

  it('should handle SET_TOKEN', () => {
    const expected = Object.assign({}, INITIAL_STATE, { token: 'abc123def456' })
    expect( reducer( undefined, setToken( 'abc123def456' ) ) ).toEqual(expected)
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
