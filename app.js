let actions = document.querySelector('.actions');
let dropdown = document.querySelector('.dropdown');

actions.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', function () {
    dropdown.style.display = 'none';
});