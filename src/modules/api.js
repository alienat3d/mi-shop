// Чтобы везде не вписывать длинные пути к серверу.
const apiPath = 'http://localhost:3001'

// Функция для получения всевозможных данных с API. Метод fetch() принимает один обязательный параметр - путь, по которому он делает запрос. И когда он получит какие-то данные, он раскроет этот ответ "response" в нужном нам формате.
export const getData = (path) => {
  return fetch(apiPath + path)
    .then(response => {
      // Если статус response не "ok", то есть false, то выкидываем ошибку.
      if (!response.ok) {
        // Если требуется можно также указать текст при ошибке в Error('текст при ошибке').
        throw new Error
      }

      return response.json()
    })
}
// В случае с GET-запросом (выше) нам достаточно было указать только путь, но в это случае с GET-запросом нам необходимо также настроить передаваемый объект "data" и указать чётко метод "body" и "header". Но и ответ от fetch() требуется также и выше обработать с then().
export const postData = (path, data) => {
  return fetch(apiPath + path, data).then(response => {
    if (!response.ok) {
      throw new Error
    }

    return response.json()
  })
}
// Создаём также функцию удаления. Также не забудем указать объект с методом "DELETE".
export const deleteData = (path) => {
  return fetch(apiPath + path, {
    method: 'DELETE'
  }).then(response => {
    if (!response.ok) {
      throw new Error
    }

    return response.json()
  })
}