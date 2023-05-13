import { postData, getData, deleteData } from "../api";

export const addCategoryFunc = () => {
  //1.1 Сперва получаем все 3 элемента нашей формы, 2 input’a и кнопку отправки.
  const nameInput = document.getElementById('category-name')
  const previewInput = document.getElementById('category-image')
  const saveBtn = document.getElementById('category-add-btn')
  const container = document.getElementById('category-container')
  // 7.1 Также нам необходимо при добавлении категорий также добавлять их в меню выбора тег <select>.
  const select = document.getElementById('product-category')

  //2.1 Также создадим пустой объект, куда будем добавлять информацию для отправки.
  const categoryData = {
    name: '',
    preview: ''
  }

  // 4.2 Отрисовываем вёрстку из полученных данных для таблицы добавления категорий в админке.
  const render = (data) => {
    container.innerHTML = ''
    // select.innerHTML = ''
    // 4.3.2 Для вывода номера позиции получим также index и выведем его в поле отображения номера позиции.
    data.forEach((item, index) => {
      container.insertAdjacentHTML('beforeend', `
        <tr class="category-row">
          <!-- 4.3.1 Для вывода номера мы могли бы использовать id, но что если одну из позиций мы потом удалим? Тогда будет выглядеть "1, 2, 3, 5", например. Для того, чтобы этого избежать… (см. выше 4.3.2) -->
          <th scope="row">${index + 1}</th>
          <td>${item.name}</td>
          <td class="text-end">
            <!-- 5.1 Для того, чтобы мочь удалять наши позиции, нам необходимо знать идентификатор-атрибута каждого из них. В этом помогут дата-атрибуты в вёрстке. -->
            <button type="button" class="btn btn-outline-danger btn-sm" data-category="${item.id}">
              удалить
            </button>
          </td>
        </tr>
      `)
      // 7.2 Также записываем и в select добавленную позицию
      select.insertAdjacentHTML('beforeend', `
        <option value="${item.id}">${item.name}</option>
      `)
    })
  }

  //1 Функция проверки value input’a и disable кнопки, если value пуст.
  const checkValues = () => {
    //1.3 Добавим условие проверки, что если value одного из input’ов является пустым, то кнопка приобретает атрибут disabled.
    if (nameInput.value === '' || previewInput.value === '') {
      saveBtn.disabled = true
    } else {
      saveBtn.disabled = false
    }
  }

  // 4.3.4 Замыкаем функцию из 4.3.3.
  const updateTable = () => getData('/categories').then((data) => render(data))

  //1.4 Каждый раз, когда мы вводим что-то в input, делаем проверку на заполненность значения value. Теперь будет куда проще работать с формой.
  nameInput.addEventListener('input', () => {
    //2.2 Теперь когда мы будем вводить в input какую-то информацию, то должен заполнятся объект categoryData под ключом "name".
    categoryData.name = nameInput.value
    checkValues()
  })

  previewInput.addEventListener('input', () => {
    //2.3 То же самое и тут, но уже под ключом "preview". Но сперва нам нужно сделать проверку на тип файла, ведь мы загружаем здесь картинки.
    // *Если бы у нас была ещё и кнопка очистить, то после очистки объекта file у нас могла появиться ошибка, т.к. нулевого объекта нет и мы обращались бы к пустому объекту. Поэтому пришлось бы добавить здесь условие на длину.

    const file = previewInput.files[0]
    // 2.4 К примеру, если мы хотим разрешить добавлять только .png, .jpeg или .jpg.
    if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
      // В случае успеха превращаем файл в строку.
      const reader = new FileReader()
      // Также, чтобы reader заработал, нужно отслушивать его событием onload. Также можно использовать addEventListener с "load".
      reader.onload = () => {
        // Теперь данные о картинке закодированные в base64 лежат в reader.result, кладём их в наш объект с ключом "preview".
        categoryData.preview = reader.result
      }
      // Может возникнуть ошибка и нам нужно её обработать. На случай, если мы допустимый тип файла поменяли на недопустимый тип файла. Очищаем оба ключа этой записи.
      reader.onerror = () => {
        categoryData.preview = ''
        previewInput.value = ''
      }

      reader.readAsDataURL(file)
    } else {
      // В случае, если в input попал неподходящий тип файла, его также следует почистить.
      previewInput.value = ''
    }

    checkValues()
  })

  // 3.1 В итоге вешаем на кнопку обработчик события и запускаем импортированную функцию сохранения данных postData. Также указать путь и через запятую настройку передаваемого объекта.
  // 3.2 [↑] на 1. строчке импортируем функцию postData() и вызываем её с путём '/categories' и прописываем настройки во втором аргументе "data" функции {method, body, headers}. Он же будет передаваться в api.js в postData(). Этот объект мы также превращаем в строку с помощью JSON.stringify(categoryData).
  // Далее слушаем с .then() ответ с сервера.
  // *!* В реальных проектах, в базах данных картинки в виде строки не хранятся, чаще всего сервер принимает файл, создаёт его реальную копию на севере, а назад отправляет ссылку на этот файл. Но т.к. у нас тестовая база, то здесь мы храним в строке. *!*
  saveBtn.addEventListener('click', () => {
    postData('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      // 8.1 Не забудем почистить input, после добавления новой категории.
      nameInput.value = ''
      previewInput.value = ''
      // 4.1 Запрашиваем весь массив категорий и отрисуем его в таблице админки. Для этого импортируем getData() и вызовем эту функцию. Далее с then() обработаем ответ "data".
      // 4.3.3 Замкнём эту функцию в updateTable (выше) [↑]
      updateTable()
    })
  })
  // 5.2.1 Обработаем клик на кнопках удалить категорию, чтобы удалять их.
  // 5.2.2 С помощью console.dir(event.target) определили, что можем ухватиться за свойство кнопки tagName, удостоверившись, что кликаем действительно по кнопке. И пишем условие проверки event.target.
  container.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      // 5.2.3 Получаем дата-атрибут с помощью спец. метода dataset
      const id = event.target.dataset.category
      // 6.1 Добавим импортированную функцию deleteData(), но укажем в ней ``, т.к. мы будем передавать туда динамические данные. Передадим туда id и обработаем ответ с then(), где также обновим нашу таблицу после удаления позиции.
      deleteData(`/categories/${id}`).then((data) => updateTable())
    }
  })

  // 4.3.5 Также зайдя на страницу нужно вызвать один раз updateTable(), чтобы отрисовать нашу базу данных в админке.
  updateTable()
  checkValues()
}