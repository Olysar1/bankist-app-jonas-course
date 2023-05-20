'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//CREATING DOM ELEMENTS:

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//COMPUTING AND PRINTING BALANCE

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//CAlCULATING SUMMARY:

const calcDispllaySummary = function (acc) {
  //money IN
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  //money OUT
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  //money INTEREST
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//COMPUTING USERNAMES:
//usernames are first letters of the firstname and the lastname in lower case(Jonas Schmedtmann -> js)
const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

//UPDATING UI:

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDispllaySummary(acc);
};

//IMPLEMENTING LIGIN:

//event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent page from reloading upon click
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //updating fund information
    updateUI(currentAccount);
  }
});

//IMPLEMENTING TRANSFERS

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  //getting values
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  //cleaning input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  //transfer
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //updating fund information
    updateUI(currentAccount);
  }
});

//IMPLEMENTING LOAN FUNCTIONALITY

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//THE FINDINDEX() METHOD//IMPLEMENTING CLOSE ACCOUNT

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    //delete account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin = '';
});

//SORTING VIA DISPLAYMOVEMENTS FUNCTION

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  ///////
  //my way:
  // if (sorted) {
  //   displayMovements(currentAccount.movements);
  //   sorted = false;
  // } else {
  //   displayMovements(currentAccount.movements, true);
  //   sorted = true;
  // }
  ///////
  //jonas's way:
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*SIMPLE ARRAY METHODS

let arr = ['a', 'b', 'c', 'd', 'e'];

//1.slice() method returns a new array:
console.log(arr);
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -1));
//creating shallow copy of an array: arr.slice() = [...arr]
console.log(arr.slice());
console.log([...arr]);

//2.splice() method mutates the original array:
//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2); //1st parameter is the same as that of slice(), but second parameter defines the quantity of the items we want to remove
console.log(arr);

//3.reverse() method reverses an array (but it also mutates it):
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//4.concat() method returns new array containing elements of two arrays //arr.concat() = [...arr, ...arr2]:
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//5.join() method joins the elements of the array using specified separator:
letters.join(' - ');
*/

/*//LOOPING ARRAYS - FOREACH():

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//for - of loop:
//for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

//forEach() loop:
//break and continue do not work in forEach()
console.log('----forEach()----');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});
*/

/*//FOREACH() WITH MAPS AND SETS:

//maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//sets
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/

/*//CODING CHELLANGE#1:

const julias = [3, 5, 2, 12, 7];
const kates = [4, 1, 15, 8, 3];
const julias1 = [9, 16, 6, 8, 3];
const kates1 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJulia1 = dogsJulia.slice(1, -2);
  const allDogs = [...dogsJulia1, ...dogsKate];
  allDogs.forEach(function (dog, i) {
    const str = dog <= 3 ? 'still a puppy' : `an adult and is ${dog} years old.`;
    console.log(`Dog number ${i + 1} is ${str}`);
  });
};

checkDogs(julias1, kates1);
*/

/*//THE MAP() METHOD:

const eurToUsd = 1.1;

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);
console.log(movements);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);
*/

/*//THE FILTER() METHOD:

const deposits = movements.filter(mov => mov > 0);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/

/*//THE REDUCE() METHOD:

console.log(movements);

// const balance = movements.reduce(function (accumulator, current, index, array) {
//   console.log(`iteration ${index}: ${accumulator}`);
//   return accumulator + current;
// }, 0);

const balance = movements.reduce(
  (accumulator, current) => accumulator + current,
  0
);
console.log(balance);

//maximum value
const findMax = movements.reduce(
  (acc, mov) => (acc = acc < mov ? mov : acc),
  movements[0]
);

console.log(findMax);
*/

/*//CODING CHALLENGE #2:

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAge = ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(dogAge => dogAge >= 18);
  //const average = humanAge.reduce((acc, age) => acc + age, 0) / adults.length;
  const average = humanAge.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  );
  console.log(humanAge);
  return average;
};

console.log(calcAverageHumanAge(data2));
*/

/*//THE MAGIC OF CHAINING METHODS:

const eurToUsd = 1.1;
console.log(movements);

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    //console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);
*/

/*//CODING CHELLANGE #3:

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAge = ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  ////const average = humanAge.reduce((acc, age) => acc + age, 0) / adults.length;
  // const average = humanAge.reduce(
  //   (acc, age, i, arr) => acc + age / arr.length,
  //   0
  // );
  console.log(humanAge);
  return humanAge;
};

console.log(calcAverageHumanAge(data2));
*/

/*//THE FIND() METHOD:

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

/*//SOME() AND EVERY()

console.log(movements);

//.includes() method checks for equality
console.log(movements.includes(-130));

//.some(function) method checks for condition
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

//.every(function) method returns true if all elements satisfy the condition
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

/*//FLAT() AND FLATMAP()

//flat()
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

//flatMap()
const accountMovements = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(accountMovements);
*/

/*//SORTING ARRAYS

//strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); //this method mutates the original array
console.log(owners);

//numbers
console.log(movements);
console.log(movements.sort()); //does not work... it converts numbers into strings

//ascending order:
//return < 0, a comes first then comes b (keep order)
//return > 0, b comes first then comes a (switch order)
////////////
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

//descending order:
////////////
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

/*//MORE WAYS OF CREATING AND FINDING ARRAYS

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

//empty arrays + fill() method
const x = new Array(7);
console.log(x);
//console.log(x.map(() => 5));

x.fill(1, 3, 5); //fill(element, start index, finish index)
x.fill(1);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

//Array.from()
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});
*/

/*//ARRAY METHODS PRACTICE

//1:
const bankDepositSumOld = accounts.map(acc => acc.movements).flat();
// .map().flat() same as .flatMap()
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

//2:
//easier
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;

console.log(numDeposits1000);

//with reduce method
const numDeposits1000Reduce = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000Reduce);

//prefixed ++ operator
let a = 10;
console.log(a++);
console.log(a);
console.log(++a);

//3:
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

//4:
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title But nOt Too lonG'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/

/*//CODING CHALLENGE #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curfood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1:
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

console.log(dogs);

//2:
const tooMuch = function (dogsArr) {
  const found = dogsArr.find(dog => dog.owners.includes('Sarah'));
  console.log(found);
  console.log(
    `dog is eating too ${found.recFood > found.curFood ? 'little' : 'much'}`
  );
};
tooMuch(dogs);

//3:
let ownersEatTooMuch = [];
let ownersEatTooLittle = [];

dogs.forEach(x =>
  x.curFood > x.recFood
    ? ownersEatTooMuch.push(x.owners)
    : ownersEatTooLittle.push(x.owners)
);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

//4:
console.log(`${ownersEatTooMuch.flat().join(' and ')}'s dogs eat too much!`);
console.log(
  `${ownersEatTooLittle.flat().join(' and ')}'s dogs eat too little!`
);

//5:

console.log(dogs.some(dog => dog.curfood === dog.recFood));

//6:
const fn = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.some(fn));

//7:
const dogsOk = dogs.filter(fn);
console.log(dogsOk);

//8:
const sortedDogs = dogs.slice().sort((a, b) => a.recFood - b.recFood);

console.log(dogs);
console.log(sortedDogs);
*/
