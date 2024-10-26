const credentials = JSON.parse(localStorage.getItem('credentials'))
if (!credentials || (credentials && credentials.type !== 'merchant')) {
  window.location.href = '/login'
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

function addProduct(e) {
  e.preventDefault()
  const productName = document.getElementById("name").value
  const productPrice = document.getElementById("price").value
  const productImage = document.getElementById("image").value.split(";")
  const productDescription = document.getElementById("description").value
  const productDiscount = document.getElementById("discount").value
  const productStock= document.getElementById("stock").value
  const productMerchant = JSON.parse(localStorage.getItem('credentials')).name

  if (!productName || !productPrice || productImage.length === 0 || !productDescription || !productStock || !productMerchant) {
    alert("Vui lòng điền đầy đủ thông tin!")
    return;
  }

  if (!confirm("Bạn chắc chắn về thông tin sản phẩm đã nhập và muốn thêm sản phẩm chứ?")) {
    return;
  }

  const voucherDivs = document.getElementById('voucher-container').getElementsByTagName('div');
  const vouchers = []
  for (const voucherDiv of voucherDivs) {
    const voucherInps = voucherDiv.getElementsByTagName('input')
    vouchers.push({
      percent: parseInt(voucherInps[0].value),
      max: parseInt(voucherInps[1].value),
    })
  }
  
  db.collection("products").add({
    name: productName,
    photos: productImage,
    price: parseInt(productPrice),
    description: productDescription,
    rating: parseFloat(5.0),
    discount: parseInt(productDiscount),
    stock: parseInt(productStock),
    merchant: {
      name: productMerchant,
      avatar: "https://phucgiaan.com/wp-content/uploads/2022/07/unnamed-7.png"
    },
    vouchers: vouchers,
    sold: 0,
    configurations: [],
    category: "Sách",
  }).then(() => alert("Sản phẩm thêm thành công!"))
}

let voucher_count = 1

function addVoucher(e) {
  e.preventDefault()
  const voucher_div = document.createElement('div')
  voucher_div.innerHTML = `<input name="voucher" type="number" step="5" placeholder="Số phần trăm (%)">
<input name="voucher" type="number" step="10000" placeholder="Tối đa (VND)">`
  document.getElementById("voucher-container").appendChild(voucher_div)
  voucher_count += 1
  if (voucher_count > 4) {
    document.getElementById("add-voucher-btn").remove();
  }
}

document.getElementById("submit-btn").addEventListener("click", addProduct)
document.getElementById("add-voucher-btn").addEventListener("click", addVoucher)