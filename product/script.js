const credentials = JSON.parse(localStorage.getItem('credentials'))
if (credentials && credentials.name) {
  const cred_div = document.createElement("span")
  cred_div.innerText = "Xin chào, " + credentials.name
  document.getElementById("navigation-bar").appendChild(cred_div)
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id')
let product = {}

const firebaseConfig = {
  apiKey: "AIzaSyBMdag_J5a_T3nsHQri5YYa6Ko5NPGGljw",
  authDomain: "shopee-f8773.firebaseapp.com",
  projectId: "shopee-f8773",
  storageBucket: "shopee-f8773.appspot.com",
  messagingSenderId: "706511062731",
  appId: "1:706511062731:web:7a85eee0a0e990cdfa3d4e",
  measurementId: "G-Y7YYVK3SSC"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

try {
  db.collection("products").doc(id).get().then((doc) => {
    console.log(doc.data())
    if (doc.exists) {
      product = doc.data()
      render()
    } else {
      window.location.href = '/'
    }
  });
} catch {
  alert("Sản phẩm không tồn tại")
  window.location.href = '/'
}

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

function approximateQuantity(quantity) {
  return quantity >= 1000? `${Math.round(quantity/1000)}k+` : quantity
}

function onChangeQuantity(event) {
  document.getElementById("total-price").innerText = formatter.format((product.price - product.discount) * parseInt(event.target.value))
}

function render() {
  const product_div = document.createElement('a')
  product_div.className = 'product'
  
  const rating_html = `${product.rating} ${'⭐️'.repeat(product.rating)}`
  
  let configuration_html = ""
  for (const configuration of product.configurations) {
    configuration_html += `<button type="button" class="config">${configuration.name}</button>\n`
  }
  
  let voucher_html = ''
  if (Array.isArray(product.vouchers)) {
    for (const voucher of product.vouchers) {
      voucher_html += `<div class="voucher-badge">Giảm ${voucher.percent}%, tối đa ${formatter.format(voucher.max)}</div>\n`
    }
  }

  let gallery_html = ''
  for (let i = 1; i < product.photos.length; i++) {
    gallery_html += `<img src="${product.photos[i]}"/>`
  }

  const original_price = formatter.format(product.price)
  const discount_price = formatter.format(product.price - product.discount)
  const discount = Math.trunc(product.discount / product.price * 100)
  
  product_div.innerHTML = `
  <div class="product-container">
    <div class="left-body">
      <div class="left-body-wrapper">
        <div class="card widget-container">
          <img src=${product.photos[0]} />
          <div class="gallery">
            ${gallery_html}
          </div>
        </div>
        <div class="product-content">
          <div class="card product-main-content">
            <h1>${product.name}</h1>
            <div class="profile-badge">
              <img src="${product.merchant.avatar}"/>
              <h2>${product.merchant.name}</h2>
            </div>
            <div class="flex-container">
              ${rating_html}
              <div>Đã bán: ${approximateQuantity(product.sold)}</div>
              <div>Khả dụng: ${product.stock}</div>
            </div>
            <div class="price-container">
              <div class="original-price">${original_price}</div>
              <div class="price">${discount_price}</div>
              <div class="voucher-badge">Giảm ${discount}%</div>
            </div>
          </div>
          <div class="card">
            <h2>Tùy chỉnh sản phẩm</h2>
            ${configuration_html || "Không"}
          </div>
          <div class="card">
            <h2>Ưu đãi</h2>
            ${voucher_html || "Không"}
          </div>
          <div class="card description-container">
            <h2>Mô tả sản phẩm</h2>
            ${product.description}
          </div>
        </div>
      </div>
    </div>
    <div class="right-body">
      <div class="card product-main-content" style="gap: 5px">
        <h2>Số lượng</h2>
        <input id="quantity-input" type="number" value="1"/>
        <h2>Tạm tính</h2>
        <div id="total-price" class="price" style="font-size: 1.5rem!important">${discount_price}</div>
        <button type="button">Mua ngay</button>
      </div>
    </div>
  </div>
  `
  document.getElementsByTagName('main')[0].appendChild(product_div)
  document.getElementById("quantity-input").addEventListener("change", onChangeQuantity)
}

function signOut() {
  localStorage.removeItem('credentials')
  window.location.reload()
}

document.getElementById("sign-out-btn").addEventListener("click", signOut)
