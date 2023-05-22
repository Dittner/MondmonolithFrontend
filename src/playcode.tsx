
export const run = () => {
  const arr = [1,2,3]
  console.log("before", arr.length)
 const el = arr.splice(0,1)
  console.log("after", arr.length, ", el= ", ...el)
}

run()