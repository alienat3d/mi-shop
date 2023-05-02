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