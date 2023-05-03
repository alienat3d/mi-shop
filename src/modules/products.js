import { getData } from "./api";

export const productsFunc = () => {
  const container = document.getElementById('products-container')
  const render = (data) => {
    data.forEach((item) => {
      container.insertAdjacentHTML('beforeend', `
        <div class="col col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
          <a href="#" class="card-link">
            <div class="card">
              <img src="${item.preview}" class="card-img-top" alt="${item.alt}">
              <div class="card-body">
                <span class="mb-2 d-block text-secondary">${item.title}</span>
                <h6 class="card-title mb-3">${item.name}</h6>

                <div class="row">
                  <div class="col d-flex align-items-center justify-content-between">
                    <h4>${item.price} ₽</h4>
                    <button type="button" class="btn btn-outline-dark">
                      <img src="./images/icon/shopping-cart-big.svg" alt="login">
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      `)
    })
  }

  // Перед тем как делаем запрос провести проверку URL-адреса и достать все query-параметры. Если query-параметр "id" есть, то мы используем его значение для получения информации конкретной категории от JSON-сервера. Если такого параметра нет, то мы получим все продукты.
  // Свойство "search" содержит query-параметры.
  const init = () => {
    const params = window.location.search
    // Далее обработаем специальным классом-конструктором данную строчку "URLSearchParams" куда мы передадим все наши параметры "params".
    const urlSearchParams = new URLSearchParams(params)
    // Теперь из "urlSearchParams" мы можем доставать параметр по его названию.
    const id = urlSearchParams.get('id')
    // Проверяем с помощью тернарного оператора есть ли id, тогда извлекаем карточки определённых товаров, а если нет id, то всех товаров.
    // Найдём в документации к JSON-server "Filter" и напишем соответственно в наш код "/products?category=${id}"
    const url = id ? `/products?category=${id}` : `/products`

    getData(url)
    .then((data) => {
      render(data)
    })
    .catch((error) => {
      console.error('Произошла ошибка!')
    })
  }

  init()
}