import { createSelector } from 'reselect'

/**
 * Select asyncInProgress status
 *
 * @param  {Object}  state
 * @return {Boolean}
 */
export const isAsyncInProgress = ( state ) => {
  return state.auth.asyncInProgress
}

/**
 * Compute if user is authenticated from user object 
 *
 * @param  {Object}  state
 * @return {Boolean}
 */
export const isAuthenticated = ( state ) => {
  return Object.keys( state.auth.user ).length > 0
}

/**
 * Get the absolute signed-in user disregarding spoofUser
 *
 * @param  {Object} state
 * @return {Object}
 */
export const selectAbsoluteUser = ( state ) => {
  return state.auth.user
}

/**
 * Get the signed-in user ( will prioritize spoofUser )
 *
 * @param  {Object} state
 * @return {Object}
 */
export const selectUser = ( state ) => {
  const { auth: { spoofUser, user } } = state
  if ( spoofUser && Object.keys( spoofUser ).length ) {
    return spoofUser
  } else if ( user && Object.keys( user ).length ) {
    return user
  } else {
    return null
  }
}

/**
 * Determine if user is spoof
 *
 * @param  {Object}  state
 * @return {Boolean}
 */
export const isSpoof = ( state ) => {
  return state.auth.spoofUser ? true : false
}

/**
 * Determine if user has administrator privileges
 * Accepts custom function block to resolve conditions
 *
 * @param  {Function} isAdminBlock
 * @return {Boolean}
 */
export const createIsAdminSelector = ( isAdminBlock ) => {
  return createSelector(
    selectAbsoluteUser,
    isAdminBlock
  )
}
