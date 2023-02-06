a = document.querySelector("[type='submit']")
b = document.querySelector('#search-form')
console.log("🚀 ~ file: index.js:3 ~ b", b)
console.log("🚀 ~ file: index.js:2 ~ a", a)
b.addEventListener('submit', onsub)

function onsub(e) {
   
    e.preventDefault();
b.classList.add('search-form__submited')
}
