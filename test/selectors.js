import expect from 'expect'
import { selectAbsoluteUser,
         selectUser,
         isSpoof,
         isAsyncInProgress,
         createIsAdminSelector } from '../src/selectors'

describe('selectors', () => {
  let state = {
    auth: {
      asyncInProgress: false,
      isAuthenticated: true,
      isChecking: false,
      token: 'storedUserTokenabc123def456',
      expireFlag: false,
      user: {
        id: 1,
        name: 'Aaron Kaz',
        token: 'storedUserTokenabc123def456',
        level: 1
      },
      spoofUser: {
        id: 2,
        name: 'Bobby Brown',
        token: 'storedSpoofUserToken'
      }
    }
  }

  it('should select absolute user', () => {
    expect( selectAbsoluteUser( state ) ).toEqual( state.auth.user)
  })

  it('should select user (with spoof)', () => {
    expect( selectUser( state ) ).toEqual( state.auth.spoofUser)
  })

  it('should handle isAsyncInProgress', () => {
    expect( isAsyncInProgress( state ) ).toEqual( false )
  })

  it('should resolve is spoof when spoof user present', () => {
    expect( isSpoof( state ) ).toEqual( true )
  })

  it('should select user (without spoof)', () => {
    delete state.auth.spoofUser
    expect( selectUser( state ) ).toEqual( state.auth.user)
  })

  it('should resolve is spoof when spoof user not present', () => {
    expect( isSpoof( state ) ).toEqual( false )
  })

  it('should handle createIsAdminSelector when true', () => {
    expect( createIsAdminSelector( user => user.level === 1)( state ) ).toEqual( true )
  })

  it('should handle createIsAdminSelector when false', () => {
    state.auth.user.level = 0
    expect( createIsAdminSelector( user => user.level === 1)( state ) ).toEqual( false )
  })

})
