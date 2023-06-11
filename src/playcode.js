var fibonacci = {
  [Symbol.iterator]: function*() {
    var pre = 0, cur = 1
    for (;;) {
      var temp = pre
      pre = cur
      cur += temp
      yield cur
    }
  }
}

for (var value of fibonacci) {
  if (value > 20)
    break
  console.log(value)
}