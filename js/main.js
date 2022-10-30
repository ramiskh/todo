const taskInput = document.querySelector('.todo__form-input')
const taskAddBtn = document.querySelector('.todo__form-button')
const taskList = document.querySelector('.todo__list')
const taskControl = document.querySelector('.todo__control')

let taskArr = [];

// Проверям LocalStorage на наличие записей
if (localStorage.getItem('TaskList')) {
	taskArr = JSON.parse(localStorage.getItem('TaskList'))
	taskArr.forEach((task) => renderTask(task));
}

taskInput.addEventListener('keydown', checkPressKey)
taskAddBtn.addEventListener('click', addTask)
taskList.addEventListener('click', deleteTask)
taskList.addEventListener('click', doneTask)
taskControl.addEventListener('click', deleteAllTask)
taskControl.addEventListener('click', deleteDoneTask)
taskControl.addEventListener('click', doneAllTask)

// Функция формирования разметки со списком задач
function renderTask(task) {
	// Формируем разметку с пунктом задачи
	const taskClass = task.done ? 'todo__item todo__item--done' : 'todo__item'
	const taskItem = `
		<div id="${task.id}" class="${taskClass}">
			<div class="todo__check" data-action="done"></div>
			<div class="todo__name">${task.name}</div>
			<div class="todo__delete" data-action="delete"></div>
		</div>
	`
	// Добавляем разметку к конец списка задач
	taskList.insertAdjacentHTML('beforeend', taskItem)
}

// Функция проверки нажатия кнопки Enter
function checkPressKey(event) {
	if (event.keyCode === 13 || event.code === 'Enter') {
		addTask()
	}
}

// Функция добавления новой задачи
function addTask() {
	// Проверяем поле ввода на пустоту
	if (!taskInput.value.trim().length) return
	
	const taskText = taskInput.value
	const taskObj = { id: Date.now(), name: taskText, done: false }
	taskArr.push(taskObj)
	
	// Добавляем новый пункт с задачей
	renderTask(taskObj)
	
	// Очищаем значение поля ввода
	taskInput.value = ''

	// Обновляем запись в LocalStorage
	saveToLocalStorage()
}

// Функция удаления задачи из списка
function deleteTask(event) {

	if (event.target.dataset.action !== 'delete') return
	
	const parent = event.target.closest('.todo__item')
	const id = Number(parent.id)
	
	taskArr = taskArr.filter(todo => todo.id !== id)
	
	parent.remove()
	
	saveToLocalStorage()
}

// Функция завершения задачи
function doneTask(event) {
	
	if (event.target.dataset.action !== 'done') return

	console.log(event.target)
	
	const parent = event.target.closest('.todo__item')
	const id = Number(parent.id)
	const task = taskArr.find(t => t.id === id)

	task.done = !task.done

	parent.classList.toggle('todo__item--done')
	
	saveToLocalStorage()
}

// Удаление завершенных задач
function deleteDoneTask(event) {
	if (event.target.dataset.action !== 'delete-done') return
	const result = confirm('Вы уверены, что хотите удалить все завершенные задачи?')
	if (result) {
		taskList.innerHTML = ''
		taskArr = taskArr.filter(todo => todo.done !== true)
		taskArr.forEach((task) => renderTask(task))
		saveToLocalStorage()
	}
}

// Удаление всех задач
function deleteAllTask(event) {
	if (event.target.dataset.action !== 'delete-all') return
	const result = confirm('Вы уверены, что хотите удалить все задачи?')
	if (result) {
		taskArr = []
		taskList.innerHTML = ''
		saveToLocalStorage()
	}
}

// Завершение всех задач
function doneAllTask(event) {
	if (event.target.dataset.action !== 'done-all') return
	const result = confirm('Вы уверены, что хотите завершить все задачи?')
	if (result) {
		taskList.innerHTML = ''
		taskArr.forEach((task) => {
			task.done = true
			renderTask(task)
		})
		saveToLocalStorage()
	}
}

function saveToLocalStorage() {
	localStorage.setItem('TaskList', JSON.stringify(taskArr))
}
