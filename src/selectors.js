import { createSelector } from 'reselect'

/**
 * Get the absolute signed-in user disregarding spoofUser
 *
 * @param  {Object} state
 * @return {Object}
 */
export const absoluteUser = ( state ) => {
  return state.auth.user
}

/**
 * Get the signed-in user ( will prioritize spoofUser )
 *
 * @param  {Object} state
 * @return {Object}
 */
export const user = ( state ) => {
  return state.auth.spoofUser || state.auth.user || null
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
export const isAdmin = ( isAdminBlock ) => {
  return createSelector(
    absoluteUser,
    isAdminBlock
  )
}
