// setup class constructor and prototype object to persist user-configurable
// constants throughout app
function ReduxAuth() {}
ReduxAuth.prototype.config = {
  getTokenFromStorage: null,
  setTokenToStorage: null,
  removeTokenFromStorage: null
}
// export config reference for destructured imports
export const config = ReduxAuth.prototype.config

export default config