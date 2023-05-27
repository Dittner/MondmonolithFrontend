export const run = () => {
  console.log("40 && 2 || 33", " = ", (40 && 2 || 33))
  console.log("(4*2) && (3*6)", " = ", ((4*2) && (3*6)))
  console.log("0 && 2", " = ", (0 && 2))
  console.log("false && 0 && ''", " = ", (false && 0 && ''))
  console.log("false || 0 || ''", " = ", (false || 0 || ''))
  console.log("false && 1", " = ", (false && 1))
  console.log("0 && 1", " = ", (0 && 1))
  console.log("false || 0", " = ", (false || 0))
  //console.log("", " = ", ())
}

run()