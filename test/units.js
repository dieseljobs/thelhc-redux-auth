import expect from 'expect'
import {
  appInitializer,
  AuthConnect,
  configureInterceptors,
  createInterceptors,
  createIsAdminSelector,
  getTokenFromStorage,
  isAuthenticated,
  isAsyncInProgress,
  isResponseRejected,
  isSpoof,
  isTokenRefreshable,
  isTokenRejected,
  isUserRejected,
  jwtToStore,
  jwtRejected,
  observers,
  reducer,
  resolveToken,
  retrieveToken,
  selectAbsoluteUser,
  selectToken,
  selectUser,
  setAsyncInProgress,
  setToken,
  setUser,
  setSpoofUser
} from '../src'

import * as all from '../src'

console.log(all)

describe('exports', () => {
  it('exports AuthConnect', () => {
    expect(AuthConnect).toBeTruthy()
  })
  it('exports appInitializer', () => {
    expect(appInitializer).toBeTruthy()
  })
  it('exports configureInterceptors', () => {
    expect(configureInterceptors).toBeTruthy()
  })
  it('exports createInterceptors', () => {
    expect(createInterceptors).toBeTruthy()
  })
  it('exports createIsAdminSelector', () => {
    expect(createInterceptors).toBeTruthy()
  })
  it('exports getTokenFromStorage', () => {
    expect(getTokenFromStorage).toBeTruthy()
  })
  it('exports isAuthenticated', () => {
    expect(isAuthenticated).toBeTruthy()
  })
  it('exports isAsyncInProgress', () => {
    expect(isAsyncInProgress).toBeTruthy()
  })
  it('exports isResponseRejected', () => {
    expect(isResponseRejected).toBeTruthy()
  })
  it('exports isSpoof', () => {
    expect(isSpoof).toBeTruthy()
  })
  it('exports isTokenRefreshable', () => {
    expect(isTokenRefreshable).toBeTruthy()
  })
  it('exports isTokenRejected', () => {
    expect(isTokenRejected).toBeTruthy()
  })
  it('exports isUserRejected', () => {
    expect(isUserRejected).toBeTruthy()
  })
  it('exports jwtToStore', () => {
    expect(jwtToStore).toBeTruthy()
  })
  it('exports jwtRejected', () => {
    expect(jwtRejected).toBeTruthy()
  })
  it('exports observers', () => {
    expect(observers).toBeTruthy()
  })
  it('exports reducer', () => {
    expect(reducer).toBeTruthy()
  })
  it('exports resolveToken', () => {
    expect(resolveToken).toBeTruthy()
  })
  it('exports retrieveToken', () => {
    expect(retrieveToken).toBeTruthy()
  })
  it('exports selectAbsoluteUser', () => {
    expect(selectAbsoluteUser).toBeTruthy()
  })
  it('exports selectToken', () => {
    expect(selectToken).toBeTruthy()
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
  it('exports setSpoofUser', () => {
    expect(setSpoofUser).toBeTruthy()
  })

})
