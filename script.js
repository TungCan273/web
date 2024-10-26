const credentials = JSON.parse(localStorage.getItem('credentials'))
if (credentials && credentials.name) {
  const cred_div = document.createElement("span")
  cred_div.innerText = "Xin chào, " + credentials.name
  document.getElementById("navigation-bar").appendChild(cred_div)
}

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
const products = []

db.collection("products").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
  });
  render()
});

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

function approximateQuantity(quantity) {
  return quantity >= 1000? `${Math.round(quantity/1000)}k` : quantity
}

function render() {
  const products_container = document.getElementsByClassName('products-container')[0]

  for (const product of products) {
    const product_div = document.createElement('a')
    product_div.href = `/product/index.html?id=${product.id}`
    product_div.className = 'product'
    product_div.innerHTML = `
    <div class="thumbnail">
      <img src=${product.photos[0]} alt="" />
    </div>
    <div class="body">
      <span class="name">${product.name}</span>
      <div class="footer">
        <span class="price">đ${formatter.format(product.price - product.discount)}</span>
        <span>Đã bán ${approximateQuantity(product.sold)}</span>
      </div>
    </div>
    `
    products_container.appendChild(product_div)
  }
}

function signOut() {
  localStorage.removeItem('credentials')
  window.location.reload()
}

document.getElementById("sign-out-btn").addEventListener("click", signOut)
