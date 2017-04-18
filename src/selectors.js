import { createSelector } from 'reselect'

export const absoluteUser = ( state ) => {
  return state.auth.user
}

export const user = ( state ) => {
  return state.auth.spoofUser ? state.auth.spoofUser : state.auth.user
}

export const isAdmin = ( isAdminBlock ) => {
  return createSelector(
    absoluteUser,
    isAdminBlock
  )
}
