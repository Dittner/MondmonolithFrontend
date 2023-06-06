const counter = () => {
  let count = 0
  return () => count++
}

let count = counter()
console.log( count() ) //0
console.log( count() ) //1
console.log( count() ) //2

count = counter()
console.log( count() ) //0
console.log( count() ) //1
console.log( count() ) //2
