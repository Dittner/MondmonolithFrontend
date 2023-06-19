function Person(firstName) {
  this.firstName = firstName

  this.sayName = function () {
    return (`I'm ${this.firstName}.`)
  }
}

const ann = new Person('Ann');
const bob = new Person('Bob');
const tom = Person('Tom');

console.log(ann.sayName())
console.log(bob.sayName())
//console.log(tom.sayName())