const users = [
  {
    name: "Hoang Khoi",
    username: 'hoangkhoi',
    email: 'khoigobrrr@gmail.com',
    password: '123456789',
    type: 'merchant'
  },
  {
    name: "Son Hoang",
    username: 'sonhoang',
    email: 'sh@gmail.com',
    password: '123456789',
    type: 'user'
  }
]

function logIn(e) {
  e.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  for (const user of users) {
    if (user.email === email && user.password === password) {
      delete user.password
      localStorage.setItem('credentials', JSON.stringify(user))
      window.location.href = '/'
      return
    }
  }

  document.getElementById('alert').innerText = "Wrong username or password!"
}

document.getElementById('submit').addEventListener('click', logIn)
