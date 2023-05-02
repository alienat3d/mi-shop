// Чтобы воспользоваться методом getData() импортируем его сюда.
import { getData } from "./api";

// Модуль, который при загрузке страницы будет обращаться к базе данных db.json через getData() и получать все данные из базы данных.
export const categoriesFunc = () => {
  const container = document.getElementById('categories-container')

  // Теперь нам необходима функция render(), которая получит контейнер для наших карточек с категориями и отрисует все категории перебором.
  // На каждой итерации нам нужно размещать вёрстку каждой карточки.
  const render = (data) => {
    data.forEach((item) => {
      container.insertAdjacentHTML('beforeend', `
        <div class="col col-12 col-md-6 col-lg-4 mb-3">
          <a href="./catalog.html?id=${item.id}" class="card-link">
            <div class="card">
              <img src="${item.preview}" class="card-img-top" alt="${item.alt}">
              <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
              </div>
            </div>
          </a>
        </div>
      `)
    })
  }

  getData('/categories')
    .then((data) => {
      render(data)
    })
    // Сообщает об ошибке в консоль специальным образом.
    .catch((error) => {
      console.error('Произошла ошибка!')
    })
}