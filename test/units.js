import expect from 'expect'
import {
  appInitializer,
  actionTypes,
  createInterceptors,
  createIsAdminSelector,
  isSpoof,
  isAuthenticated,
  isAsyncInProgress,
  observers,
  reducer,
  selectAbsoluteUser,
  selectUser,
  setAsyncInProgress,
  setToken,
  setUser,
  getTokenFromStorage,
  isTokenRefreshable
} from '../src'

describe('exports', () => {
  it('exports appInitializer', () => {
    expect(appInitializer).toBeTruthy()
  })
  it('exports actionTypes', () => {
    expect(actionTypes).toBeTruthy()
  })
  it('exports createInterceptors', () => {
    expect(createInterceptors).toBeTruthy()
  })
  it('exports createIsAdminSelector', () => {
    expect(createInterceptors).toBeTruthy()
  })
  it('exports isSpoof', () => {
    expect(isSpoof).toBeTruthy()
  })
  it('exports isAuthenticated', () => {
    expect(isAuthenticated).toBeTruthy()
  })
  it('exports isAsyncInProgress', () => {
    expect(isAsyncInProgress).toBeTruthy()
  })
  it('exports observers', () => {
    expect(observers).toBeTruthy()
  })
  it('exports reducer', () => {
    expect(reducer).toBeTruthy()
  })
  it('exports selectAbsoluteUser', () => {
    expect(selectAbsoluteUser).toBeTruthy()
  })
  it('exports selectUser', () => {
    expect(selectUser).toBeTruthy()
  })
  it('exports setAsyncInProgress', () => {
    expect(setAsyncInProgress).toBeTruthy()
  })
  it('exports setToken', () => {
    expect(setToken).toBeTruthy()
  })
  it('exports setUser', () => {
    expect(setUser).toBeTruthy()
  })
  it('exports getTokenFromStorage', () => {
    expect(getTokenFromStorage).toBeTruthy()
  })
  it('exports isTokenRefreshable', () => {
    expect(isTokenRefreshable).toBeTruthy()
  })

})
