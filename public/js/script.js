//hamburger menu

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("is-active"); 
});


//flash messge disappear


  window.addEventListener('DOMContentLoaded', () => {
    const flash = document.querySelector('.flash-overlay');
    if (flash) {
      setTimeout(() => {
        flash.classList.add('hide');
      }, 2000);
    }
  });





