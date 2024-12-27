import './style.css';
import './media.css';
import { productCard } from './product.js';

const container = document.querySelector(".favorites-container")
const favorites = JSON.parse(localStorage.getItem("favorites")) || []

if (favorites.length === 0) {
  const noItems = document.createElement("div")
  noItems.classList.add("no-items")

  const noItemsImage = document.createElement("img")
  noItemsImage.src = "./public/logos/hearts.png"
  noItemsImage.classList.add("no-items-image")

  const message = document.createElement("p")
  message.classList.add("no-items-message")
  message.textContent = "Добавьте то, что понравилось"

  const subtext = document.createElement("p")
  subtext.classList.add("no-items-subtext")
  subtext.textContent = "Перейдите на главную страницу и нажмите на ♡ в товаре"

  const actionLink = document.createElement("a")
  actionLink.href = "index.html"
  actionLink.classList.add("no-items-subtext")
  actionLink.textContent = "На главную"

  noItems.append(noItemsImage, message, subtext, actionLink)
  container.append(noItems)
} 
else {
  const favoritesTitle = document.createElement("h2")
  favoritesTitle.classList.add("favorites-title")
  favoritesTitle.textContent = "Избранное"

  const favoritesListContainer = document.createElement("div")
  favoritesListContainer.classList.add("favorites-list-container")

  container.append(favoritesTitle, favoritesListContainer)

  favorites.forEach(product => {
    productCard(product, favoritesListContainer)
  })
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