import expect from 'expect'
import createReducer from '../src/reducer'
import { setIsChecking,
         setToken,
         setUser,
         setAuthenticated,
         expire,
         setSpoofUser } from '../src/actions'

const reducer = createReducer()

describe('reducer', () => {

  it('should handle initial state', () => {
    expect( reducer( undefined, { type: '@@INIT' } ) ).toEqual({
      isAuthenticated: false,
      isChecking: false,
      token: null,
      expireFlag: false,
      user: {
      }
    })
  })

  it('should handle SET_IS_CHECKING', () => {
    expect( reducer( undefined, setIsChecking( true ) ) ).toEqual({
      isAuthenticated: false,
      isChecking: true,
      token: null,
      expireFlag: false,
      user: {
      }
    })
  })

  it('should handle SET_TOKEN', () => {
    expect( reducer( undefined, setToken( 'abc123def456' ) ) ).toEqual({
      isAuthenticated: false,
      isChecking: false,
      token: 'abc123def456',
      expireFlag: false,
      user: {
      }
    })
  })

  it('should handle SET_USER', () => {
    const user = {
      id: 1,
      fname: 'Aaron',
      lname: 'Kaz'
    }
    expect( reducer( undefined, setUser( user ) ) ).toEqual({
      isAuthenticated: false,
      isChecking: false,
      token: null,
      expireFlag: false,
      user: user
    })
  })

  it('should handle SET_AUTHENTICATED', () => {
    expect( reducer( undefined, setAuthenticated( true ) ) ).toEqual({
      isAuthenticated: true,
      isChecking: false,
      token: null,
      expireFlag: false,
      user: {
      }
    })
  })

  it('should handle SET_SPOOF_USER', () => {
    const spoofUser = {
      id: 2,
      fname: 'Spoof',
      lname: 'Dude'
    }
    expect( reducer( undefined, setSpoofUser( spoofUser ) ) ).toEqual({
      isAuthenticated: false,
      isChecking: false,
      token: null,
      expireFlag: false,
      user: {
      },
      spoofUser: spoofUser
    })
  })

})
