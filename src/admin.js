"use strict";

const authBtn = document.getElementById('open-auth-btn');
const modal = document.getElementById('auth-modal');
const closeBtns = modal.querySelectorAll('.close-btn');
const loginBtn = modal.querySelector('.login-btn');
const openCartBtn = document.getElementById('open-cart-btn');
const logoutBtn = document.getElementById('logout-btn');

//3 Создаём функцию открытия модального окна.
const openModal = () => {
  modal.classList.add('d-block')

  setTimeout(() => {
    modal.classList.add('show')
  }, 200)
}

//4 Создаём функцию закрытия модального окна.
const closeModal = () => {
  modal.classList.remove('show')

  setTimeout(() => {
    modal.classList.remove('d-block')
  }, 200)
}

//5 Создаём функцию логина. Скрывает одну кнопку и показывает две другие.
const login = () => {
  authBtn.classList.add('d-none')
  openCartBtn.classList.remove('d-none')
  logoutBtn.classList.remove('d-none')
  closeModal()
}
//6 Создаём функцию логаута.
const logout = () => {
  authBtn.classList.remove('d-none')
  openCartBtn.classList.add('d-none')
  logoutBtn.classList.add('d-none')
}

//6.4 При помощи метода JSON.parse() переводим строчные данные в объект. Теперь, если объект существует, то мы вызываем функцию login().
const checkAuth = () => {
  if (JSON.parse(localStorage.getItem('auth'))) {
    login()
  }
}

//1 Т.к. по ТЗ нам нужно давать модальному окну класс "show" с небольшой задержкой для отработки анимации появления окна, то используем setTimeout(), с установленным таймером на 200мс (т.к. transition .15s).
authBtn.addEventListener('click', openModal)
//4.1 (пример) Мы могли бы перебрать массив "closeBtns" обычным циклом.
// for (let i = 0; i < closeBtns; i++) {
//   console.log(closeBtns[i])
// }
//4.2 Но в современном JS есть способ проще, forEach(). Таким образом для каждого элемента в массиве метод forEach() запустит функцию. Функция принимает аргументом каждый элемент (любого названия) и на этот элемент мы уже повесим например обработчик события по клику. И по клику вызывается функция closeModal().
//4.3 Т.к. используются стрелочные функции, то запись можно упростить (см. 4.4).
// closeBtns.forEach((btn) => {
//   btn.addEventListener('click', () => {
//     closeModal()
//   })
// })

//4.4
closeBtns.forEach((btn) => btn.addEventListener('click', closeModal))

loginBtn.addEventListener('click', () => {
  const loginInput = modal.querySelector('#login-control')
  const passwordInput = modal.querySelector('#password-control')
  //6.1 Также создадим объект user, где одно значение будет содержать введённый логин, а другое пароль, введённые пользователем.
  const user = {
    login: loginInput.value,
    password: passwordInput.value
  }

  //6.2 Теперь сохраняем данного пользователя в localStorage. Передаём в метод сохранения setItem() два обязательных аргумента. 1-ый — ключ, по которому мы будем сохранять данные юзера "auth", а 2-ой — данные из "user" в виде строки для сохранения в localStorage. Для перевода в строчный тип данных используем JSON.stringify().
  localStorage.setItem('auth', JSON.stringify(user))
  //6.3 Теперь login & password пользователя хранятся в ячейке памяти localStorage на его компьютере. Теперь сделаем проверку, если в auth есть его данные, то он автоматически авторизуется на нашем сайте. Для этого нужна функция checkAuth(). [↑]
  login()
})

//7 Нам также нужно по клику на кнопке logout удалять данные из ячейки localStorage.
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('auth')

  logout()
})

//6.5 Также мы будем вызывать эту функцию при загрузке страницы.
checkAuth()