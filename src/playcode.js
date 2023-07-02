const uniqueArray = (arr) => [...new Set(arr)]
const uniqueArray2 = (arr) => arr.sort().reduce((a, b) => {
  if (a[a.length - 1] !== b) a.push(b)
  return a
}, [])

const a = [5, 1, 2, 0, -1, 4, 3, 4, 5, -1, 0]
const res1 = uniqueArray(a)
const res2 = uniqueArray2(a)
console.log('res1 = ', res1)
console.log('res2 = ', res2)
