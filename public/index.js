const sizeBtns = document.getElementsByClassName('sizeBtn');
const orderBtns = document.getElementsByClassName('orderBtn');
const customBtns = document.getElementsByClassName('customBtn');
Array.from(sizeBtns).forEach(button => {
	button.addEventListener('click', setSizeValue);
});
// !drink size functions
function setSizeValue(e) {
	let targetValue = e.target.value;

	const costumerOrder = document.querySelector('#drinkSize');
	costumerOrder.value = targetValue;
	console.log(costumerOrder.value);
	setCustomerOrder();
}
// ! drink order functions
Array.from(orderBtns).forEach(button => {
	button.addEventListener('click', orderValue);
});
function orderValue(e) {
	let targetValue = e.target.value;
	console.log(targetValue);
	const costumerOrder = document.querySelector('#drinkOrder');

	costumerOrder.value = targetValue;
	console.log(costumerOrder.value);
	setCustomerOrder();
}
let orderArr = [];
// !custom order functions
var ul = document.getElementById('customList');

Array.from(customBtns).forEach(button => {
	button.addEventListener('click', customValues);
});
function customValues(e) {
	let targetValue = e.target.value;
	const costumerOrder = document.querySelector('#customize');
	orderArr.push(targetValue);
	let newOrderArr = [...new Set(orderArr)];

	costumerOrder.value = newOrderArr.join(' ');
	createList();
	setCustomerOrder();
}
//loop through custom string, add each letter to listarray, make a set, then loop through and put elements in dom
// use function to clear list before running array loop
function createList() {
	let custom = document.querySelector('#customize').value;
	var ul = document.getElementById('customList');
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}
	let listArray = [];
	for (let word of custom) {
		listArray.push(word);
	}
	listArray = listArray.join('').split(' ');
	console.log(listArray);
	listArray.forEach(el => {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(el));
		ul.appendChild(li);
	});
}

function setCustomerOrder() {
	let drinkSize = document.querySelector('#drinkSize').value;
	let drinkOrder = document.querySelector('#drinkOrder').value;
	let custom = document.querySelector('#customize').value;
	const custumerOrder = document.querySelector('#costumerOrder');
	custumerOrder.value = `${drinkSize} ${drinkOrder} ${custom}`;
}
