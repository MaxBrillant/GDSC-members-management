// Action button for each member should
// have a actions button, and when it is clicked we want to show
//  the dropdown with the buttons "edit" and "delete"

let actions = document.querySelector('.actions');
let dropdown = document.querySelector('.dropdown');

//when the actions button is clicked, we want to show the actions in the dropdown
actions.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});
//if the actions button has been clicked, anything else that is clicked will 
// make the dropdown disappear
document.addEventListener('click', () => {
    dropdown.style.display = 'none';
});



//We want to deal with the opening and closing of the "new member" popup.
let popupBackground = document.querySelector(".popup-background");
let closeButton = document.querySelector(".close-popup");
let addButton = document.querySelector(".addMember");

popupBackground.addEventListener('click', (event) => {
    if(event.target === popupBackground){
        popupBackground.style.display = 'none';
    }
})
closeButton.addEventListener('click', () => {
    popupBackground.style.display = 'none';
})
addButton.addEventListener('click', () => {
    popupBackground.style.display = 'block';
})




//When we click the "Change profile picture" button, it shall trigger the file picker and select an image.
//Once the image is selected, we want to set it on the preview image.


const selectImageButton = document.querySelector('.selectImageButton');
const fileInput = document.querySelector('.fileInput');
const previewImage = document.querySelector('.previewImage');

selectImageButton.addEventListener('click', function() {
    fileInput.click();
});

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            fileInput.value = ''; // Clear the file input value after setting the image source
        };
        reader.readAsDataURL(file);
    }
});





//Each time we select a programming language ,
//we want to add it to our programming list

let languageSelect = document.querySelector(".language-select");
let languageList = document.querySelector(".language-list");

languageSelect.addEventListener('change', (event)=> {

    //if the selected option is not the placeholder value
    if(event.target.value !== languageSelect.firstElementChild.value) {
        
        //We are going to create a new language element that has a name and a closing button
        let language = document.createElement('div');
        language.className = 'language';

        let name = document.createElement('span');
        
        const selectedIndex = languageSelect.selectedIndex;
        const selectedText = languageSelect.options[selectedIndex].text;
        name.innerHTML = selectedText;
        language.appendChild(name);

        let closeButton = document.createElement('button');
        closeButton.className = 'btn-close';
        language.appendChild(closeButton);


        languageList.appendChild(language);

        //Each time we add language to the list, we want to remove it from the language select
        languageSelect.remove(selectedIndex);


        //When we click on the close button of a languange that is already on the list, 
        //we will remove it from the list and add it back to the language select element.
        closeButton.addEventListener('click', (event) => {
            const maxIndex = languageSelect.options.length;
            let newOption = new Option(name.innerHTML, "'"+maxIndex+"'");
            languageSelect.add(newOption);
            languageList.removeChild(event.target.parentElement);
        });


    }
});