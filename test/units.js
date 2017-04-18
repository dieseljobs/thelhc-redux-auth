import expect from 'expect'
import {
  actionTypes,
  checkForUser,
  createInterceptors,
  observers,
  reducer,
  resetAuth,
  selectors,
  setAuthenticated,
  setIsChecking,
  setToken,
  setUser,
  setUserAuth,
  spoofUser
} from '../src'

describe('redux-thunk-status', () => {
  it('exports actionTypes', () => {
    expect(actionTypes).toBeTruthy()
  })
  it('exports checkForUser', () => {
    expect(checkForUser).toBeTruthy()
  })
  it('exports createInterceptors', () => {
    expect(createInterceptors).toBeTruthy()
  })
  it('exports observers', () => {
    expect(observers).toBeTruthy()
  })
  it('exports reducer', () => {
    expect(reducer).toBeTruthy()
  })
  it('exports resetAuth', () => {
    expect(resetAuth).toBeTruthy()
  })
  it('exports selectors', () => {
    expect(selectors).toBeTruthy()
  })
  it('exports setIsChecking', () => {
    expect(setIsChecking).toBeTruthy()
  })
  it('exports setAuthenticated', () => {
    expect(setAuthenticated).toBeTruthy()
  })
  it('exports setToken', () => {
    expect(setToken).toBeTruthy()
  })
  it('exports setUser', () => {
    expect(setUser).toBeTruthy()
  })
  it('exports setUserAuth', () => {
    expect(setUserAuth).toBeTruthy()
  })
  it('exports spoofUser', () => {
    expect(spoofUser).toBeTruthy()
  })

})
