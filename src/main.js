import './style.css'
import './media.css';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { productCard } from './product.js';

const swiper = new Swiper('.swiper', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true, 
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true, 
  },
  autoplay: {
    delay: 5000, 
    disableOnInteraction: false, 
  },
  slidesPerView: 1,
  spaceBetween: 10,
}); 

fetch("/db.json")
  .then(response => response.json())
  .then(data => {
    const products = data.products || []
    const categories = {}

    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = []
      }
      categories[product.category].push(product)
    })

    const productContainer = document.querySelector(".product_container")
    productContainer.innerHTML = ""

    for (const category in categories) {
      const categoryContainer = document.createElement("div")
      categoryContainer.classList.add("category-container")

      const categoryHeader = document.createElement("h2")
      categoryHeader.classList.add("category-header")
      categoryHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1)
      categoryContainer.append(categoryHeader)

      const productsListContainer = document.createElement("div")
      productsListContainer.classList.add("products-list-container")

      categories[category].forEach(product => {
        productCard(product, productsListContainer)
      })

      categoryContainer.append(productsListContainer)
      productContainer.append(categoryContainer)
    }
  })

const scrollBtn= document.querySelector(".scroll-btn")

window.onscroll = () => {
  if (window.scrollY > 700) { 
    scrollBtn.style.display = "flex"
  } else {
    scrollBtn.style.display = "none"
  }
}

scrollBtn.onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
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

const loginLink = document.querySelector('.login-link')
const loginModal = document.getElementById('login-modal')
const closeBtn = document.querySelector('.custom-close-btn')
const phoneInput = document.getElementById('phone')

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