// 1 Переносим как нужные нам переменные, изменяя попутно их id, так и функции из [addCategory.js].
import { postData, getData, deleteData } from "../api";

export const addProductFunc = () => {
  const titleInput = document.getElementById('product-title')
  const nameInput = document.getElementById('product-name')
  const priceInput = document.getElementById('product-price')
  const previewInput = document.getElementById('product-image')
  const saveBtn = document.getElementById('product-add-btn')
  const container = document.getElementById('product-table')
  const select = document.getElementById('product-category')

  const productData = {
    title: '',
    name: '',
    price: 0,
    preview: '',
    category: 0 // 3.1 Необходимо для правильного отображения товаров в его категории.
  }

  const render = (data) => {
    container.innerHTML = ''
    data.forEach((item, index) => {
      container.insertAdjacentHTML('beforeend', `
        <tr class="product-row">
          <th scope="row">${index + 1}</th>
          <td>${item.title}</td>
          <td>${item.name}</td>
          <td>${item.price} ₽</td>
          <td class="text-end">
            <button type="button" class="btn btn-outline-danger btn-sm" data-product="${item.id}">
              удалить
            </button>
          </td>
        </tr>
      `)
    })
  }

  const checkValues = () => {
    // 2.1 Проверим все input’ы, чтобы они не были пустыми.
    // 2.2 Также проверим, чтобы была выбрана хоть какая-то категория, прежде чем мы сможем добавлять в неё товары.
    // 2.3 Сделаем также проверку на выбранную категорию <option>, т.е. не равен ли он "default" строке.
    if (
      titleInput.value === '' ||
      nameInput.value === '' ||
      Number(priceInput.value) === 0 || // 2.4.1 Цены лучше записывать в числах.
      previewInput.value === '' ||
      select.value === 'default'
    ) {
      saveBtn.disabled = true
    } else {
      saveBtn.disabled = false
    }
  }

  function updateTable () {
    getData('/products').then((data) => render(data))
  }

  // 3.2 Записываем значение выбранной позиции в select и записываем его value в объект под ключом "category".
  select.addEventListener('change', () => {
    productData.category = select.value
    // Если нет конкретной категории, то будут выведены в таблицу все товары.
    const url = select.value !== 'default' ? `/products?category=${select.value}` : `/products`
    // Необходимо сделать получение данных конкретной категории.
    getData(url).then((data) => render(data))
    checkValues()
  })

  nameInput.addEventListener('input', () => {
    productData.name = nameInput.value
    checkValues()
  })

  titleInput.addEventListener('input', () => {
    productData.title = titleInput.value
    checkValues()
  })

  priceInput.addEventListener('input', () => {
    productData.price = Number(priceInput.value) // 2.4.2 Соответственно и тут тоже должно быть в числах.
    checkValues()
  })

  previewInput.addEventListener('input', () => {
    const file = previewInput.files[0]

    if (
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg'
      ) {
      const reader = new FileReader()

      reader.onload = () => {
        productData.preview = reader.result
      }

      reader.onerror = () => {
        productData.preview = ''
        previewInput.value = ''
      }

      reader.readAsDataURL(file)
    } else {
      previewInput.value = ''
    }

    checkValues()
  })

  saveBtn.addEventListener('click', () => {
    postData('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      titleInput.value = ''
      nameInput.value = ''
      priceInput.value = ''
      previewInput.value = ''

      updateTable()
    })
  })

  container.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const id = event.target.dataset.product
      deleteData(`/products/${id}`).then((data) => updateTable())
    }
  })

  updateTable()
  checkValues()
}