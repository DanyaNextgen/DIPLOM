import './style.css';
import './media.css';

const container = document.querySelector(".basket-container")
const cart = JSON.parse(localStorage.getItem("cart")) || []

updateCart()

function updateCart() {
  container.innerHTML = ''
  if (cart.length === 0) {
    const noItems = document.createElement("div")
    noItems.classList.add("no-items")

    const noItemsImage = document.createElement("img")
    noItemsImage.src = "./public/logos/shopcat.png"
    noItemsImage.classList.add("no-items-image")

    const message = document.createElement("p")
    message.classList.add("no-items-message")
    message.textContent = "В корзине пока нет товаров"

    const subtext = document.createElement("p")
    subtext.classList.add("no-items-subtext")
    subtext.textContent = "Начните с подборок на главной странице или найдите нужный товар через поиск"

    const actionLink = document.createElement("a")
    actionLink.href = "index.html"
    actionLink.classList.add("no-items-subtext")
    actionLink.textContent = "На главную"

    noItems.append(noItemsImage, message, subtext, actionLink)
    container.append(noItems)
  } else {
    const basketTitle = document.createElement("h2")
    basketTitle.classList.add("basket-title")
    basketTitle.textContent = "Корзина товаров"
    container.append(basketTitle)

    const contentContainer = document.createElement("div")
    contentContainer.classList.add("basket-content-container")

    const basketListContainer = document.createElement("div")
    basketListContainer.classList.add("basket-list-container")

    const totalAndCheckoutContainer = document.createElement("div")
    totalAndCheckoutContainer.classList.add("total-and-checkout-container")

    container.append(contentContainer)
    contentContainer.append(basketListContainer, totalAndCheckoutContainer)

    let totalAmount = 0
    let totalItems = 0

    cart.forEach(product => {
      const cartItem = document.createElement("div")
      cartItem.classList.add("cart-item")

      const img = document.createElement("img")
      img.src = product.thumbnail
      img.alt = product.title
      img.classList.add("cart-item-image")

      const itemDetails = document.createElement("div")
      itemDetails.classList.add("cart-item-details")

      const title = document.createElement("span")
      title.textContent = product.title
      title.classList.add("cart-item-title")

      const price = document.createElement("span")
      price.textContent = `$${product.price}`
      price.classList.add("cart-item-price")

      const quantityContainer = createCounter(product.quantity || 1, product.stock, newQuantity => {
        product.quantity = newQuantity
        localStorage.setItem("cart", JSON.stringify(cart))
        updateCart()
      })

      const removeBtn = document.createElement("button")
      removeBtn.textContent = "Удалить"
      removeBtn.classList.add("cart-item-remove")

      removeBtn.onclick = () => {
        const updatedCart = cart.filter(item => item.id !== product.id)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        updateCart()
      }

      itemDetails.append(title, price, quantityContainer, removeBtn)
      cartItem.append(img, itemDetails)
      basketListContainer.appendChild(cartItem)

      totalAmount += product.price * (product.quantity || 1)
      totalItems += product.quantity || 1
    })

    const totalSummaryContainer = document.createElement("div")
    totalSummaryContainer.classList.add("total-summary-container")

    const totalItemsElem = document.createElement("p")
    totalItemsElem.classList.add("total-items")
    totalItemsElem.textContent = `Итого товаров: ${totalItems}`

    const totalAmountElem = document.createElement("p")
    totalAmountElem.classList.add("total-amount")
    totalAmountElem.textContent = `$${totalAmount.toFixed(2)}`

    totalSummaryContainer.append(totalAmountElem, totalItemsElem)
    totalAndCheckoutContainer.append(totalSummaryContainer)

    const checkoutBtn = document.createElement("button")
    checkoutBtn.classList.add("checkout-btn")
    checkoutBtn.textContent = "Оформить заказ"
    checkoutBtn.onclick = () => {
      if (cart.length === 0) {
        const noItemsMessage = document.createElement("p")
        noItemsMessage.classList.add("no-items-message")
        noItemsMessage.textContent = "Ваша корзина пуста. Добавьте товары в корзину."
        container.append(noItemsMessage)
      } else {
        window.location.href = "/checkout.html"
      }
    }

    totalAndCheckoutContainer.append(checkoutBtn)
  }
}

function createCounter(initialValue, maxCount, onUpdate) {
  const counterContainer = document.createElement("div")
  counterContainer.classList.add("counter-container")

  const minusBtn = document.createElement("button")
  minusBtn.textContent = "-"

  const counterValue = document.createElement("span")
  counterValue.textContent = initialValue
  counterValue.classList.add("counter-value")

  const plusBtn = document.createElement("button")
  plusBtn.textContent = "+"

  let currentCount = initialValue

  minusBtn.onclick = () => {
    if (currentCount > 1) {
      currentCount--
      counterValue.textContent = currentCount
      if (onUpdate) onUpdate(currentCount)
    }
  }

  plusBtn.onclick = () => {
    if (currentCount < maxCount) {
      currentCount++
      counterValue.textContent = currentCount
      if (onUpdate) onUpdate(currentCount)
    }
  }

  counterContainer.append(minusBtn, counterValue, plusBtn)
  return counterContainer
}

const catalogBtn = document.querySelector(".catalog-btn")
const mobileCatalog = document.querySelector(".mobile_catalog")
const modal = document.getElementById("catalog-modal")
const categoryList = document.getElementById("category-list")

catalogBtn.onclick = () => {
  loadCategories()
  modal.style.display = "block"
}

mobileCatalog.onclick = () => {
  loadCategories()
  modal.style.display = "block"
}

function loadCategories() {
  fetch("/db.json") 
    .then(response => response.json())
    .then(data => {
      const products = data.products
      const categoriesCount = {}

      products.forEach(product => {
        const category = product.category
        if (categoriesCount[category]) {
          categoriesCount[category]++
        } 
        else {
          categoriesCount[category] = 1
        }
      })

      categoryList.innerHTML = ""
      for (const category in categoriesCount) {
        const listItem = document.createElement("li")
        listItem.textContent = `${category} `

        const countSpan = document.createElement("span")
        countSpan.textContent = `${categoriesCount[category]} товаров`

        listItem.append(countSpan)
        categoryList.append(listItem)
      }
    })
}

const searchInput = document.getElementById("search")
const searchModal = document.getElementById("search-modal")
const productList = document.getElementById("product-list")

let productsData = []

fetch("/db.json")
  .then(response => response.json())
  .then(data => {
    productsData = data.products
  })

function searchProducts(query) {
  return productsData.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase())
  )
}

function showResults(results) {
  productList.innerHTML = ""

  results.forEach(item => {
    const listItem = document.createElement('li')
    listItem.innerText = item.title
    productList.append(listItem)
  })
  searchModal.style.display = "block"
}

searchInput.oninput = () => {
  const query = searchInput.value.trim();
  const matchedProducts = searchProducts(query)
  showResults(matchedProducts)
}

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none"
  }
  if (event.target === searchModal) {
    searchModal.style.display = "none"
  }
}

const uzumBtn = document.querySelector(".uzum-btn")

uzumBtn.onclick = () => {
  window.location.href = "index.html"
}

const favoriteLink = document.querySelector(".favorites-link")
const basketLink = document.querySelector(".basket-link")

favoriteLink.onclick = () => {
  window.location.href = "favorites.html"
}

basketLink.onclick = () => {
  window.location.href = "basket.html"
}

const loginLink = document.querySelector('.login-link');
const loginModal = document.getElementById('login-modal');
const closeBtn = document.querySelector('.custom-close-btn');
const phoneInput = document.getElementById('phone');

loginLink.onclick = () => {
  loginModal.style.display = 'block'
}

closeBtn.onclick = () => {
  loginModal.style.display = 'none'
}

phoneInput.oninput = (event) => {
  let value = event.target.value
  value = value.replace(/[^\d]/g, '')

  const prefix = '998'
  if (value.length === 0) {
    value = prefix;
  } 
  else if (value.length <= 3) {
    value = prefix.substring(0, value.length)
  } 
  else {
    value = prefix + value.substring(3)
  }

  let formattedValue = '+998 '

  if (value.length > 3) {
    formattedValue += value.slice(3, 5)
  }
  if (value.length > 5) {
    formattedValue += ' ' + value.slice(5, 8)
  }
  if (value.length > 8) {
    formattedValue += '-' + value.slice(8, 10)
  }
  if (value.length > 10) {
    formattedValue += '-' + value.slice(10, 12)
  }
  if (formattedValue.length > 17) {
    formattedValue = formattedValue.slice(0, 17)
  }

  event.target.value = formattedValue
}