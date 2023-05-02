export const openModal = (modal) => {
  const layout = document.createElement('div')
  layout.classList.add('modal-backdrop')
  layout.classList.add('fade')
  document.body.append(layout)
  // Иначе тоже самое, что выше можно записать и так:
  // document.body.insertAdjacentHTML('beforeend', `
  //   <div class="modal-backdrop fade"></div>
  // `)
  modal.classList.add('d-block')

  setTimeout(() => {
    // const layout = document.querySelector('.modal-backdrop')
    layout.classList.add('show')
    modal.classList.add('show')
  }, 200)
}

// Чтобы не было багов в JSON-server, добавим проверку к существованию layout и только если он есть мы будем удалять его класс и вёрстку. Это современный синтаксис проверки любых переменных.
export const closeModal = (modal) => {
  const layout = document.querySelector('.modal-backdrop')
  layout && layout.classList.remove('show')
  modal.classList.remove('show')

  setTimeout(() => {
    layout && layout.remove()
    modal.classList.remove('d-block')
  }, 200)
}