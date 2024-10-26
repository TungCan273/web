const credentials = JSON.parse(localStorage.getItem('credentials'))
if (!credentials || (credentials && credentials.type !== 'merchant')) {
  window.location.href = '/login'
}

if (credentials && credentials.name) {
  const cred_div = document.createElement("span")
  cred_div.innerText = "Xin chào, " + credentials.name
  document.getElementById("navigation-bar").appendChild(cred_div)
}

function signOut() {
  localStorage.removeItem('credentials')
  window.location.reload()
}

document.getElementById("sign-out-btn").addEventListener("click", signOut)
