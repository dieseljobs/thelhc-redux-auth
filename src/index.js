import createAll from './createAll'

export const {
  actionTypes,
  checkForUser,
  createInterceptors,
  createIsAdminSelector,
  isSpoof,
  observers,
  reducer,
  resetAuth,
  selectAbsoluteUser,
  selectUser,
  setAuthenticated,
  setIsChecking,
  setToken,
  setUser,
  setUserAuth,
  spoofUser
} = createAll()
