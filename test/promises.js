import expect from 'expect'
import { checkForUserPromise } from '../src/promises'

describe('promises', () => {

  it('exports checkForUserPromise', () => {
    expect(checkForUserPromise).toBeTruthy()
  })

})
