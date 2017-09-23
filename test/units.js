import expect from 'expect'
import {
  appInitializer,
  actionTypes,
  createInterceptors,
  createIsAdminSelector,
  isSpoof,
  observers,
  reducer,
  selectAbsoluteUser,
  selectUser,
  setAuthenticated,
  setIsChecking,
  setToken,
  setUser
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

})
