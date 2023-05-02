import { openModal, closeModal } from './modals'
import { getData } from './api'
export const authFunc = () => {
  const authBtn = document.getElementById('open-auth-btn')
  const modal = document.getElementById('auth-modal')
  const closeBtns = modal.querySelectorAll('.close-btn')
  const loginBtn = modal.querySelector('.login-btn')
  const openCartBtn = document.getElementById('open-cart-btn')
  const logoutBtn = document.getElementById('logout-btn')
  const cartModal = document.getElementById('cart-modal')
  const login = () => {
    authBtn.classList.add('d-none')
    openCartBtn.classList.remove('d-none')
    logoutBtn.classList.remove('d-none')
    closeModal(modal)
  }
  const logout = () => {
    authBtn.classList.remove('d-none')
    openCartBtn.classList.add('d-none')
    logoutBtn.classList.add('d-none')
  }
  // При перезагрузке страницы авторизация до сих пор зависела от localStorage, а это неправильно. Нам нужно сделать такой же запрос при загрузке страницы, как и при логине. И давать авторизацию только в том случае, если данные из localStorage совпадают с теми, что хранятся на сервере. Получаем юзера "const user = JSON.parse(localStorage.getItem('auth'))". Далее, если user имеется, то тогда пробуем его авторизовать, иначе не авторизуем.
  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem('auth'))

    if (user) {
      getData('/profile').then((data) => {
        if (
          (data.login && data.login === user.login) &&
          (data.password && data.password === user.password)
        ) {
          login()
        } else {
          alert('Вы ввели неверные данные!')
        }
      })
    }
  }

  authBtn.addEventListener('click', () => {
    openModal(modal)
  })

  closeBtns.forEach((btn) => btn.addEventListener('click', () => {
    closeModal(modal)
  }))

  loginBtn.addEventListener('click', () => {
    const loginInput = modal.querySelector('#login-control')
    const passwordInput = modal.querySelector('#password-control')
    const user = {
      login: loginInput.value,
      password: passwordInput.value
    }
    // Получаем данные из db.json и сверяем их с тем, что ввёл пользователь. И если данные совпадают, то авторизуем его, а если нет, то выдаём сообщение об ошибке.
    getData('/profile').then((data) => {
      if (
          (data.login && data.login === user.login) &&
          (data.password && data.password === user.password)
      ) {
        localStorage.setItem('auth', JSON.stringify(data))
        login()
      } else {
        alert('Вы ввели неверные данные!')
      }
    })
  })

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('auth')
    logout()
  })

  checkAuth()
}