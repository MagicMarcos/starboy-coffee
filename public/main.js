var orderStatus = document.getElementsByClassName('status');

var trash = document.getElementsByClassName('fa-trash');

// Array.from(thumbUp).forEach(el => console.log(el.value));

Array.from(orderStatus).forEach(function (element) {
	// if (element.value === 'complete') {
	// 	element.checked = true;
	// 	element.parentNode.childNodes[5].classList.add('completed');
	// }
	element.addEventListener('click', function (e) {
		const order = this.parentNode.childNodes[5];
		const costumerOrder = this.parentNode.childNodes[5].innerText;
		const status = this.parentNode.childNodes[3];
		const orderRes = this.parentNode.childNodes[1].innerText;
		const objId = e.target.dataset.objid;
		const target = e.target;
		console.log(target);

		console.log(orderRes);
		if (status.value === 'incomplete') {
			stateOrder(orderRes, costumerOrder);
			fetch('upVote', {
				method: 'put',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					costumerOrder: costumerOrder,
					status: status.value,
					baristaName: status.id,
					objId: objId,
				}),
			})
				.then(response => {
					if (response.ok) return response.json();
				})
				.then(data => {
					order.classList.add('completed');
					console.log(status.value);

					window.location.reload();
				});
			return;
		} else {
			console.log('changing to incomplete');
			// console.log()
			fetch('downVote', {
				method: 'put',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					costumerOrder: costumerOrder,
					status: status.value,
				}),
			})
				.then(response => {
					if (response.ok) return response.json();
				})
				.then(data => {
					order.classList.remove('completed');
					window.location.reload();
					console.log(status.value);
					console.log(data);
				});
			return;
		}
	});
});

Array.from(trash).forEach(function (element) {
	element.addEventListener('click', function () {
		fetch('delete', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				// costumerOrder: costumerOrder,
				id: element.value,
			}),
		}).then(function (response) {
			window.location.reload();
		});
	});
});

const clearAll = document.querySelector('.clearListBtn');
clearAll.addEventListener('click', clearList);

function clearList() {
	Array.from(trash).forEach(el => {
		const costumerOrder = this.parentNode.parentNode.childNodes[5].innerText;

		// const msg = this.parentNode.parentNode.childNodes[3].innerText;
		fetch('deleteAll', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				costumerOrder: costumerOrder,
			}),
		}).then(function (response) {
			console.log('deleted ALl');
		});
	});
	window.location.reload();
}

const clearCompleteBtn = document.querySelector('.clearCompleteBtn');
clearCompleteBtn.addEventListener('click', clearComplete);

function clearComplete() {
	Array.from(trash).forEach(el => {
		const status = this.parentNode.parentNode.childNodes[3].innerText;

		// const msg = this.parentNode.parentNode.childNodes[3].innerText;
		fetch('deleteCompleted', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				status: status,
			}),
		}).then(function (response) {
			console.log('deleted ALl');
		});
	});
	window.location.reload();
}

const synth = window.speechSynthesis;
// document.querySelector('#yell').addEventListener('click', run)
//
function stateOrder(order, costumerOrder) {
	const yellText = `${order} your ${costumerOrder} is ready!`;

	let yellThis = new SpeechSynthesisUtterance(yellText);

	synth.speak(yellThis);
}
