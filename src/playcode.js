function regexIndexOf(text, rgx, beginAt) {
  const index = text.substring(beginAt || 0).search(rgx)
  return (index >= 0) ? (index + beginAt) : index
}

const code = '```js '

const found = code.match(/^```([a-zA-Z]+) */)
const lang = found.length > 1 && found[1]
console.log('lang = ', lang)

const row = '    else '
let isParentIfConditionOrForLoop = /^ *(if)|(for)|(else if) *\(/.test(row) && /\) *$/.test(row)
isParentIfConditionOrForLoop = isParentIfConditionOrForLoop || /^ *else *$/.test(row)

console.log('res1 = ', isParentIfConditionOrForLoop)
