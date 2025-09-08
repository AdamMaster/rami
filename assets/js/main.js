// Модалки
const modal = {
  modalElements: document.querySelectorAll('.modal'),
  modalContainerElements: document.querySelectorAll('.modal-container'),
  animationSpeed: 200,
  open(modalId) {
    if (modalId) {
      const modalElement = document.querySelector(`#${modalId}`)
      modalElement.classList.add('show')
      document.documentElement.style.scrollbarGutter = 'stable'
      document.body.style.overflow = 'hidden'

      setTimeout(() => {
        modalElement.querySelector('.modal-container').classList.add('fade')
      }, 1);
    }
  },
  close() {
    this.modalElements.forEach(modalElement => {
      modalElement.querySelector('.modal-container').classList.remove('fade')

      setTimeout(() => {
        modalElement.classList.remove('show')
        document.documentElement.style.scrollbarGutter = ''
        document.body.style.overflow = ''
      }, this.animationSpeed);
    })
  }
}

const modals = document.querySelectorAll('.modal')
const modalOpenTriggers = document.querySelectorAll('[data-modal]')
const modalCloseTriggers = document.querySelectorAll('[data-modal-close]')

document.body.addEventListener('click', e => {
  if (e.target.dataset.modal) {
    modal.open(e.target.dataset.modal)
  } else return
})

modalCloseTriggers.forEach(modalCloseTrigger => {
  modalCloseTrigger.addEventListener('click', () => {
    modal.close()
  })
})

modals.forEach(item => {
  item.querySelector('.modal-container').style.transition = `${modal.animationSpeed * 0.001}s`
  item.addEventListener('mousedown', e => {
    e.target === item ? modal.close() : null
  })
})

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modal.close()
  }
})

// Запрет на введение всех символов кроме цифр у определенных инпутов
const banLetters = () => {
  const inputsTypeNumber = document.querySelectorAll('.input-phone')
  inputsTypeNumber.forEach(item => {
    item.addEventListener('input', () => {
      item.value = item.value.replace(/[^0-9]/g, '')
    })
  })
}
banLetters()

// Мобильное меню
const mobileMenu = () => {
  const buttonOpen = document.querySelector('.burger')
  const buttonClose = document.querySelector('.mobile-menu .close-button')
  const menu = document.querySelector('.mobile-menu')
  const links = document.querySelectorAll('.mobile-menu-link')

  const open = () => {
    menu.classList.add('show')
  }
  const hide = () => {
    menu.classList.remove('show')
  }

  buttonOpen.addEventListener('click', () => {
    open()
  })

  buttonClose.addEventListener('click', () => {
    hide()
  })

  links.forEach(item => {
    item.addEventListener('click', () => {
      hide()
    })
  })
}
mobileMenu()

// Анимация при наведении на карточку товара
const cardsImgAnimation = () => {
  const imgContainers = document.querySelectorAll('.card-img-container')

  imgContainers.forEach((imgContainer) => {
    const images = imgContainer.querySelectorAll('.card-img')

    const onHover = () => {
      images[0].classList.remove('show')
      images[1].classList.add('show')
    }
    const onOut = () => {
      images[0].classList.add('show')
      images[1].classList.remove('show')
    }

    imgContainer.addEventListener('mouseover', () => {
      if (images.length > 1) {
        onHover()
      }
    })
    imgContainer.addEventListener('mouseout', () => {
      if (images.length > 1) {
        onOut()
      }
    })
  })
}
cardsImgAnimation()

// Слайдеры
if (window.innerWidth < 1) {
  const swiperProducts = new Swiper('.catalog .swiper', {
    slidesPerView: 4,
    spaceBetween: 15,
    mousewheel: true,
    grabCursor: true,
    speed: 500,
    loop: true,
    breakpoints: {
      320: {
        slidesPerView: 1.5,
      },
      480: {
        slidesPerView: 2.5,
      },
      575: {
        slidesPerView: 2.5,
      },
      767: {
        slidesPerView: 3,
      },
      991: {
        slidesPerView: 4,
      }
    }
  })
}

const forms = document.querySelectorAll('.form')

const postData = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    body: data
  })

  return await response.text()
}

forms.forEach(form => {
  const inputs = form.querySelectorAll('.input')
  const inputsRequired = form.querySelectorAll('.required')
  const checkbox = form.querySelector('.checkbox-inp')
  const button = form.querySelector('.form-button')

  const inputValidate = (input => {
    const validateEmail = (email) => {
      const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      return regex.test(email);
    }

    if (!input.value) {
      input.classList.remove('valid')
      input.classList.add('not-valid')
    } else {
      input.classList.add('valid')
      input.classList.remove('not-valid')
    }
    if (input.name === 'phone') {
      if (input.value.length <= 2) {
        input.classList.remove('valid')
        input.classList.add('not-valid')
      } else {
        input.classList.add('valid')
        input.classList.remove('not-valid')
      }
    }
    if (input.name === 'email') {
      if (!validateEmail(input.value)) {
        input.classList.remove('valid')
        input.classList.add('not-valid')
      } else {
        input.classList.add('valid')
        input.classList.remove('not-valid')
      }
    }
  })

  inputs.forEach(input => {
    input.addEventListener('focus', () => {

    })
    input.addEventListener('blur', () => {
      input.classList.remove('not-valid')
    })
    input.addEventListener('input', () => {
      inputValidate(input)
    })
  })

  const changeButtonDisabled = () => {
    if (!checkbox.checked) {
      button.disabled = true
    } else {
      button.disabled = false
    }
  }

  checkbox.addEventListener('change', () => {
    console.log(checkbox.checked)
    changeButtonDisabled()
  })


  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const isAllInputsValid = Array.from(inputsRequired).every(input => input.classList.contains('valid'))

    if (isAllInputsValid && checkbox.checked) {
      if (form.classList.contains('feedback-form')) {
        postData('mail.php', formData)
          .then(() => {
            modal.close()
            setTimeout(() => {
              modal.open('modal-thanks')
            }, 200);
          })
          .catch(() => {
            console.log('Письмо не отправилось')
          })
          .finally(() => {
            form.reset()
          })
      }
    } else {
      inputsRequired.forEach(input => {
        inputValidate(input)
      })
    }
  })

})


const inputsPhone = document.querySelectorAll('.input-phone')

inputsPhone.forEach(item => {
  IMask(
    item,
    {
      mask: '+{7}(000)000-00-00'
    }
  )
})

const sizeRange = [
  {
    xxs: ["145-155", "35-45", "69-75", "58-63"],
    xs: ["150-155", "40-45", "75-81", "63-68"],
    s: ["155-160", "45-50", "81-87", "68-73"],
    m: ["160-165", "50-55", "87-93", "73-78"],
    l: ["165-170", "55-60", "93-99", "78-83"],
    xl: ["170-175", "60-65", "99-105", "83-88"],
    xxl: ["175-180", "65-70", "105-111", "88-93"],
  },
  {
    xxs: ["145-155", "35-45", "69-75", "58-63"],
    xs: ["150-155", "40-45", "75-81", "63-68"],
    s: ["155-160", "45-50", "81-87", "68-73"],
    m: ["160-165", "50-55", "87-93", "73-78"],
    l: ["165-170", "55-60", "93-99", "78-83"],
    xl: ["170-175", "60-65", "99-105", "83-88"],
    xxl: ["175-180", "65-70", "105-111", "88-93"],
  },
  {
    s: ["34.5", "39.5"],
    m: ["37", "42"],
    l: ["39", "44.5"],
    xl: ["42", "48",],
    xxl: ["44.5", "49.5"],
    xxxl: ["47", "52"],
  },
  {
    xxs: ["140-155", "35-40", "63-68", "52-57", "44-46"],
    xs: ["150-155", "40-45", "63-68", "57-62", "46-48"],
    s: ["155-160", "45-50", "68-73", "63-68", "49-51"],
    m: ["160-165", "50-55", "73-78", "69-74", "51-53"],
    l: ["165-170", "55-60", "78-83", "75-80", "54-56"],
    xl: ["170-175", "60-65", "83-88", "81-86", "57-60"],
    xxl: ["175-180", "65-70", "88-93", "87-92", "61-64"],
  },
  {
    xxs: ["140-155", "35-40", "63-68", "52-57", "44-46"],
    xs: ["150-155", "40-45", "63-68", "57-62", "46-48"],
    s: ["155-160", "45-50", "68-73", "63-68", "49-51"],
    m: ["160-165", "50-55", "73-78", "69-74", "51-53"],
    l: ["165-170", "55-60", "78-83", "75-80", "54-56"],
    xl: ["170-175", "60-65", "83-88", "81-86", "57-60"],
    xxl: ["175-180", "65-70", "88-93", "87-92", "61-64"],
  },
  {
    s: ["34.5", "39.5"],
    m: ["37", "42"],
    l: ["39", "44.5"],
    xl: ["42", "48",],
    xxl: ["44.5", "49.5"],
    xxxl: ["47", "52"],
  },
  {
    xxs: ["145", "35-40", "51-56", "43-45", "58-63", "17-19"],
    xs: ["150", "40-45", "57-62", "46-48", "63-68", "20-22"],
    s: ["155", "45-50", "63-68", "49-51", "68-73", "23-25"],
    m: ["160", "50-55", "69-74", "51-53", "73-78", "26-28"],
    l: ["165", "55-60", "75-30", "54-56", "78-83", "29-31"],
    xl: ["170", "60-65", "82-90", "57-60", "83-88", "32-34"],
    xxl: ["175", "65-70", "87-92", "61-64", "88-93", "35-37"],
  }
]

const onClickButtonSizes = () => {
  const buttons = document.querySelectorAll('.card-button-sizes')
  const modal = document.querySelector('#modal-sizes')
  const tableRows = modal.querySelectorAll('.sizes-table-row')
  const tableHeadRow = modal.querySelector('.sizes-table-head .sizes-table-row')
  const tableBodyRow = modal.querySelector('.sizes-table-body .sizes-table-row')

  const setCGridTemplateColumns = (value) => {
    tableRows.forEach(tableRow => {
      tableRow.style.gridTemplateColumns = `repeat(${value}, 1fr)`
    })

  }

  const renderHeaderCol = (value) => {
    const col = document.createElement('div')
    col.classList.add('sizes-table-col')
    col.innerText = value.toUpperCase()

    return col
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const data = sizeRange[index]

      if (data) {
        setCGridTemplateColumns(Object.keys(data).length)

        tableHeadRow.innerHTML = ''
        tableBodyRow.innerHTML = ''

        Object.keys(data).forEach(key => {
          tableHeadRow.appendChild(renderHeaderCol(key))
          const tableCol = document.createElement('div')
          tableCol.classList.add('sizes-table-col')

          tableBodyRow.appendChild(tableCol)
          data[key].forEach(value => {
            const tableColItem = document.createElement('div')
            tableColItem.classList.add('sizes-table-col-item')
            tableColItem.innerText = value

            tableCol.appendChild(tableColItem)
          })
        })
      }


    })
  })

}

onClickButtonSizes()