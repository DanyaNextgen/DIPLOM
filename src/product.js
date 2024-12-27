import './style.css';
import './media.css';

export function productCard(product, container) {
    const card = document.createElement("div"),
          img = document.createElement("img"),
          like = document.createElement("img"),
          title = document.createElement("h2"),
          rating = document.createElement("p"),
          price = document.createElement("p"),
          button = document.createElement("button"),
          priceBtnContainer = document.createElement("div"),
          cartIcon = document.createElement("img"),
          starImg = "/public/logos/starIcon.png";

    card.classList.add("product-card")
    img.src = product.thumbnail
    img.alt = product.title
    img.classList.add("product-image")
    like.src = "/public/logos/like_logo.svg"
    like.classList.add("product-like")

    title.classList.add("product-title")
    title.textContent = product.title

    rating.classList.add("product-rating")
    rating.innerHTML = `<img src="${starImg}"> ${product.rating}`

    price.classList.add("product-price")
    price.textContent = `$${product.price}`

    priceBtnContainer.classList.add("pricebtn-container")
    priceBtnContainer.append(price, button)

    cartIcon.src = "/public/logos/cartIcon.svg"
    cartIcon.classList.add("cart-icon")

    button.classList.add("add-to-cart")
    button.append(cartIcon)
    button.onclick = (event) => {
      event.stopPropagation()
      addToCart(product)
    }


    card.append(img, like, title, rating, priceBtnContainer)
    container.append(card)

    let favorites = JSON.parse(localStorage.getItem("favorites")) || []

    let isFavorite = false

    favorites.forEach(fav => {
      if (fav.id === product.id) {
          isFavorite = true
      }
    })

    if (isFavorite) {
      like.src = "/public/logos/filled_like_logo.svg"
    }

    like.onclick = () => {
      favorites = JSON.parse(localStorage.getItem("favorites")) || []
      if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== product.id)
        like.src = "/public/logos/like_logo.svg"
      } 
      else {
        favorites.push(product);
        like.src = "/public/logos/filled_like_logo.svg"
      }
      localStorage.setItem("favorites", JSON.stringify(favorites))
      isFavorite = !isFavorite
    }

    card.onclick = (event) => {
      if (event.target !== like) {
        localStorage.setItem("productId", product.id)
        window.location.href = "product.html"
      }
    }
}  

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  const isProductInCart = cart.some(item => item.id === product.id)

  if (!isProductInCart) {
      cart.push(product)
      localStorage.setItem("cart", JSON.stringify(cart))
  }
}

const productContainer = document.querySelector(".product-detail")

fetch('/db.json')
  .then(response => response.json())
  .then(data => {
    const products = data.products || []
    const productId = localStorage.getItem("productId")
    let favorites = JSON.parse(localStorage.getItem("favorites")) || []

    if (productContainer) {
      if (productId) {
        const product = products.find(p => p.id == productId)

        if (product) {
          const card = document.createElement("div")
          card.classList.add("card-detail")

          const imagesContainer = document.createElement("div")
          imagesContainer.classList.add("img-container")

          const largeImg = document.createElement("img")
          largeImg.src = product.images[0]
          largeImg.classList.add("large-img")

          for (let i = 0; i < 4; i++) {
            const smallImg = document.createElement("img")
            smallImg.src = product.images[0]
            smallImg.classList.add("small-img")

            smallImg.onclick = () => {
              largeImg.src = product.images[0]
            }

            imagesContainer.appendChild(smallImg)
          }

          const infoContainer = document.createElement("div")
          infoContainer.classList.add("product-info-detail")

          const title = document.createElement("h1")
          title.textContent = product.title

          const price = document.createElement("p")
          price.classList.add("price")
          price.textContent = `$${product.price}`

          const counterContainer = document.createElement("div")
          counterContainer.classList.add("counter-container")

          const minusBtn = document.createElement("button")
          minusBtn.textContent = "-"

          const counterValue = document.createElement("span")
          counterValue.textContent = "1"
          counterValue.classList.add("counter-value")

          const plusBtn = document.createElement("button")
          plusBtn.textContent = "+"

          let currentCount = 1
          const maxCount = product.stock

          minusBtn.onclick = () => {
            if (currentCount > 1) {
              currentCount -= 1
              counterValue.textContent = currentCount
            }
          }
          plusBtn.onclick = () => {
            if (currentCount < maxCount) {
              currentCount += 1
              counterValue.textContent = currentCount
            }
          }
          counterContainer.append(minusBtn, counterValue, plusBtn)

          const line = document.createElement("hr")

          const description = document.createElement("p")
          description.textContent = product.description

          const btnContainer = document.createElement("div")
          btnContainer.classList.add("btn-container")
          const basketBtn = document.createElement("button")
          basketBtn.textContent = "Добавить в корзину"
          basketBtn.onclick = () => {
            addToCart(product)
          }

          const favoritesBtn = document.createElement("button")
          favoritesBtn.textContent = "Добавить в избранное"

          btnContainer.append(basketBtn, favoritesBtn)
          infoContainer.append(title, price, counterContainer, line, description, btnContainer)
          card.append(imagesContainer, largeImg, infoContainer)

          const deskContainer = document.createElement("div")
          deskContainer.classList.add("desk-container")
          const deskTitle = document.createElement("h2")
          deskTitle.classList.add("desk-title")
          deskTitle.textContent = "Описание товара"
          const descriptionBottom = document.createElement("p")
          descriptionBottom.textContent = product.description

          deskContainer.append(deskTitle, descriptionBottom)
          productContainer.append(card, deskContainer)

          favoritesBtn.onclick = () => {
            let isFavorite = false
            favorites.forEach(fav => {
              if (fav.id === product.id) {
                isFavorite = true
              }
            })

            if (isFavorite) {
              favorites = favorites.filter(fav => fav.id !== product.id)
            } else {
              favorites.push(product)
            }
            localStorage.setItem("favorites", JSON.stringify(favorites))
          }

          const similarProductsContainer = document.createElement("div")
          similarProductsContainer.classList.add("similar-products")

          const similarTitle = document.createElement("h2")
          similarTitle.textContent = "Похожие товары"

          const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id)

          similarProducts.forEach(similarProduct => {
            const similarCard = document.createElement("div")
            similarCard.classList.add("product-card")

            const similarImg = document.createElement("img")
            similarImg.src = similarProduct.thumbnail
            similarImg.alt = similarProduct.title
            similarImg.classList.add("product-image")

            const similarTitle = document.createElement("p")
            similarTitle.classList.add("product-title")
            similarTitle.textContent = similarProduct.title

            const similarPrice = document.createElement("p")
            similarPrice.textContent = `$${similarProduct.price}`
            similarPrice.classList.add("product-price")

            const similarLike = document.createElement("img")
            similarLike.src = "/public/logos/like_logo.svg"
            similarLike.classList.add("product-like")

            let isSimilarFavorite = false
            favorites.forEach(fav => {
              if (fav.id === similarProduct.id) {
                isSimilarFavorite = true
              }
            })

            if (isSimilarFavorite) {
              similarLike.src = "/public/logos/filled_like_logo.svg"
            }

            const similarRating = document.createElement("p")
            similarRating.classList.add("product-rating")

            const starImg = "/public/logos/starIcon.png"
            similarRating.innerHTML = `<img src="${starImg}"> ${product.rating}`

            const similarPriceBtnContainer = document.createElement("div")
            similarPriceBtnContainer.classList.add("pricebtn-container")

            const cartIcon = document.createElement("img")
            cartIcon.src = "/public/logos/cartIcon.svg"
            cartIcon.classList.add("cart-icon")

            const similarButton = document.createElement("button")
            similarButton.classList.add("add-to-cart")
            similarButton.append(cartIcon)

            similarPriceBtnContainer.append(similarPrice, similarButton)
            similarCard.append(similarImg, similarLike, similarTitle, similarRating, similarPriceBtnContainer)

            similarLike.onclick = (event) => {
              event.stopPropagation()
              let isFavoriteSimilar = false
              favorites.forEach(fav => {
                if (fav.id === similarProduct.id) {
                  isFavoriteSimilar = true
                }
              })

              if (isFavoriteSimilar) {
                favorites = favorites.filter(fav => fav.id !== similarProduct.id)
                similarLike.src = "/public/logos/like_logo.svg"
              } else {
                favorites.push(similarProduct)
                similarLike.src = "/public/logos/filled_like_logo.svg"
              }
              localStorage.setItem("favorites", JSON.stringify(favorites))
            }

            similarCard.onclick = () => {
              localStorage.setItem("productId", similarProduct.id)
              window.location.href = "product.html"
            }

            similarProductsContainer.append(similarCard)
          })

          productContainer.append(similarTitle, similarProductsContainer)
        }
      }
    }
  })

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