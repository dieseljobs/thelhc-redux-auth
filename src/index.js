import createAll from './createAll'

export const {
  appInitializer,
  actionTypes,
  checkForUser,
  createInterceptors,
  createIsAdminSelector,
  isSpoof,
  jwtToStore,
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
  spoofUser,
  STORED_TOKEN,
  STORED_USER,
  STORED_SPOOF_USER
} = createAll()
