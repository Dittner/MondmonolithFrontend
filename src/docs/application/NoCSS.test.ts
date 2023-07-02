import { describe, expect, test } from '@jest/globals'
import { abbreviations } from './NoCSS'

describe('NoCSS module', () => {
  test('check unique abbreviations', () => {
    const hash = new Map<string, string>()
    for (const cssProp in abbreviations) {
      expect(hash.get(abbreviations[cssProp])).toBeUndefined()
      hash.set(abbreviations[cssProp], cssProp)
    }
  })
})
