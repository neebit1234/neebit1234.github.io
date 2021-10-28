function changeBackground(element, color) {
  element.style.backgroundColor = color;
}

//main
//All answer buttons default to incorrect and set background to red
document.querySelectorAll('.answerbtn').forEach(item => {
    item.addEventListener('click', event => {
      changeBackground(item, "red");
    })
  })

//If the button is in the correct class set background to cyan
document.querySelectorAll('.correctanswerbtn').forEach(item => {
  item.addEventListener('click', event => {
    changeBackground(item,  "cyan");
  })
})