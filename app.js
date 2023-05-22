loadMembersIntoTheApp();

//We want to deal with the opening and closing of the "new member" popup.
const popupBackground = document.querySelector(".popup-background");
const closeButton = document.querySelector(".close-popup");
const addButton = document.querySelector(".addMember");
const cancelButton = document.querySelector(".cancelButton");

popupBackground.addEventListener("click", (event) => {
  if (event.target === popupBackground) {
    popupBackground.style.display = "none";
  }
});
closeButton.addEventListener("click", () => {
  popupBackground.style.display = "none";
});
addButton.addEventListener("click", () => {
  clearForm();
  popupBackground.style.display = "block";
  let fullName = document.querySelector(".fullName");
  fullName.focus();
  languageList.innerHTML = "";
});

cancelButton.addEventListener("click", () => {
  popupBackground.style.display = "none";
});

//When we click the "Change profile picture" button, it shall trigger the file picker and select an image.
//Once the image is selected, we want to set it on the preview image.

const selectImageButton = document.querySelector(".selectImageButton");
const fileInput = document.querySelector(".fileInput");
const previewImage = document.querySelector(".previewImage");

selectImageButton.addEventListener("click", function (event) {
  event.preventDefault();
  fileInput.click();
});

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      fileInput.value = ""; // Clear the file input value after setting the image source
    };
    reader.readAsDataURL(file);
  }
});

//Each time we select a programming language ,
//we want to add it to our programming list

const languageSelect = document.querySelector(".language-select");
const languageList = document.querySelector(".language-list");

languageSelect.addEventListener("change", handleLanguageSelectChange);

function handleLanguageSelectChange(event) {
  if (event.target.value !== languageSelect.firstElementChild.value) {
    const selectedIndex = languageSelect.selectedIndex;
    const selectedText = languageSelect.options[selectedIndex].text;
    setSelectedLanguage(selectedText);
  }
}

function setSelectedLanguage(languageName) {
  const language = createLanguageElement(languageName);
  languageList.appendChild(language);

  disableSelectedLanguageOption(languageName);

  const closeButton = language.querySelector(".btn-close");
  closeButton.addEventListener("click", handleLanguageCloseButtonClick);
}

function createLanguageElement(languageName) {
  const language = document.createElement("div");
  language.className = "language";

  const name = document.createElement("span");
  name.className = "languageName";
  name.innerHTML = languageName;
  language.appendChild(name);

  const closeButton = document.createElement("button");
  closeButton.className = "btn-close";
  language.appendChild(closeButton);

  return language;
}

function disableSelectedLanguageOption(languageName) {
  for (let i = 0; i < languageSelect.options.length; i++) {
    if (languageSelect.options[i].text === languageName) {
      languageSelect.selectedIndex = 0;
      languageSelect.options[i].disabled = true;
    }
  }
}

function handleLanguageCloseButtonClick(event) {
  const languageName = event.target.parentElement.querySelector(".languageName").innerText;
  enableLanguageOption(languageName);
  languageList.removeChild(event.target.parentElement);
}

function enableLanguageOption(languageName) {
  for (let i = 0; i < languageSelect.options.length; i++) {
    if (languageSelect.options[i].text === languageName) {
      languageSelect.options[i].disabled = false;
    }
  }
}


//When we click on the "Add member" button, we are going to create a new member object and store it in local memory

const addMemberButton = document.querySelector(".saveMember");
const fullNameField = document.querySelector(".fullName");
const emailAddressField = document.querySelector(".emailAddress");
const roleField = document.querySelector(".role-select");
const twitterField = document.querySelector(".twitter");
const linkedinField = document.querySelector(".linkedin");
const githubField = document.querySelector(".github");
const error = document.querySelector(".errorMessage");

//This is the selected member that will be edited or deleted
let selectedMemberIndex = -1;

addMemberButton.addEventListener("click", () => {
  const selectedLanguagesNames = [];

  const selectedLanguages = languageList.querySelectorAll(".language");
  //let's get all the languages
  selectedLanguages.forEach((selectedLanguage, index) => {
    selectedLanguagesNames[index] = selectedLanguage.innerText;
  });

  //If the role is not selected, we will make the member a regular member
  if (roleField.selectedIndex === 0) {
    roleField.selectedIndex = 1;
  }

  //get the already stored members
  let teamMembers = getAllMembers();

  if (fullNameField.value !== "" && emailAddressField.value !== "") {
    //Create a team member object;
    let teamMember = {
      fullName: fullNameField.value,
      emailAddress: emailAddressField.value,
      role: roleField.options[roleField.selectedIndex].text,
      languages: selectedLanguagesNames,
      profileImageLink: previewImage.src,
      twitterLink: twitterField.value,
      linkedinLink: linkedinField.value,
      githubLink: githubField.value,
    };

    if (selectedMemberIndex === -1) {
      //Add the new team member to the list of team members
      saveMember(teamMembers.length, teamMember);
    } else {
      saveMember(selectedMemberIndex, teamMember);
      selectedMemberIndex = -1;
    }

    clearForm();
    loadMembersIntoTheApp();
  } else {
    error.style.display = "block";
  }
});

//Save a member

function saveMember(index, teamMember) {
  let teamMembers = getAllMembers();
  teamMembers[index] = teamMember;
  console.log(teamMembers);

  //Save all team members to local storage

  const teamMembersJSON = JSON.stringify(teamMembers);
  // Store the JSON string in localStorage
  localStorage.setItem("GDSCteamMembers", teamMembersJSON);

  //close the popup
  popupBackground.style.display = "none";
}

function deleteMember(index) {
  let teamMembers = getAllMembers();
  teamMembers.splice(index);
  console.log(teamMembers);

  //Save all team members to local storage

  const teamMembersJSON = JSON.stringify(teamMembers);
  // Store the JSON string in localStorage
  localStorage.setItem("GDSCteamMembers", teamMembersJSON);

  //close the popup
  popupBackground.style.display = "none";
}

function clearForm() {
    
    //Scroll to the top


  if (popupBackground.style.display == "none") {
    //setting back the values to default

    fullNameField.value = "";
    emailAddressField.value = "";
    previewImage.src = "";
    roleField.selectedIndex = 0;
    languageSelect.selectedIndex = 0;

    for (let i = 0; i < languageSelect.options.length; i++) {
      languageSelect.selectedIndex = 0;
      languageSelect.options[i].disabled = false;
    }

    languageList.innerHTML = "";
    twitterField.value = "";
    linkedinField.value = "";
    githubField.value = "";
  }
}

//Get all saved Members from local storage

function getAllMembers() {
  const objectsJSON = localStorage.getItem("GDSCteamMembers");
  let retrievedObjects = [];
  retrievedObjects = JSON.parse(objectsJSON);
  if (retrievedObjects == null) {
    retrievedObjects = [];
  }
  return retrievedObjects;
}

function loadMembersIntoTheApp() {
  const members = getAllMembers();
  let team = document.querySelector(".team");
  team.innerHTML = "";
  let counter = document.querySelector(".count");

  if (members.length > 0) {
    //Updating the counter
    counter.style.display = "flex";
    counter.innerText = members.length;

    members.forEach((member, index) => {
      const teamMember = document.createElement("div");
      teamMember.className = "teamMember";
      team.appendChild(teamMember);

      const ul = document.createElement("ul");
      const li = document.createElement("li");

      const actionsButton = document.createElement("button");
      actionsButton.className = "actions";
      const actionsImg = document.createElement("img");
      actionsImg.src = "/Images/Icons/three-dots.svg";
      actionsButton.appendChild(actionsImg);

      const dropdown = document.createElement("ul");
      dropdown.className = "dropdown";

      // Action button for each member should
      // have a actions button, and when it is clicked we want to show
      //  the dropdown with the buttons "edit" and "delete"

      //when the actions button is clicked, we want to show the actions in the dropdown
      actionsButton.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      });
      //if the actions button has been clicked, anything else that is clicked will
      // make the dropdown disappear
      document.addEventListener("click", () => {
        dropdown.style.display = "none";
      });

      const editLi = document.createElement("li");
      const editButton = document.createElement("button");
      editButton.className = "actionButton";
      const editImg = document.createElement("img");
      editImg.src = "/Images/Icons/edit.svg";
      editButton.innerHTML = " Edit";
      editButton.insertBefore(editImg, editButton.childNodes[0]);
      editLi.appendChild(editButton);

      editButton.addEventListener("click", () => {
        
        popupBackground.style.display = "flex";
        selectedMemberIndex = index;

        fullNameField.value = member.fullName;
        fullNameField.focus();
        emailAddressField.value = member.emailAddress;
        previewImage.src = member.profileImageLink;

        for (let i = 0; i < roleField.options.length; i++) {
          if (roleField.options[i].text === member.role) {
            roleField.selectedIndex = i;
          }
        }

        //load all the languages and display them
        languageList.innerHTML = "";
        for (let i = 0; i < languageSelect.options.length; i++) {
          languageSelect.selectedIndex = 0;
          languageSelect.options[i].disabled = false;
        }
        member.languages.forEach((language) => {
          setSelectedLanguage(language);
        });
        twitterField.value = member.twitterLink;
        linkedinField.value = member.linkedinLink;
        githubField.value = member.githubLink;
      });

      const deleteLi = document.createElement("li");
      const deleteButton = document.createElement("button");
      deleteButton.className = "actionButton";
      const deleteImg = document.createElement("img");
      deleteImg.src = "/Images/Icons/delete.svg";
      deleteButton.innerHTML = " Delete";
      deleteButton.insertBefore(deleteImg, deleteButton.childNodes[0]);
      deleteLi.appendChild(deleteButton);

      deleteButton.addEventListener("click", () => {
        deleteMember(index);
        loadMembersIntoTheApp();
      });

      dropdown.appendChild(editLi);
      dropdown.appendChild(deleteLi);
      li.appendChild(actionsButton);
      li.appendChild(dropdown);
      ul.appendChild(li);
      teamMember.appendChild(ul);

      const profileP = document.createElement("p");
      profileP.className = "profile";
      const profileImg = document.createElement("img");
      profileImg.src = member.profileImageLink;
      profileImg.alt = "";
      profileP.appendChild(profileImg);
      teamMember.appendChild(profileP);

      const nameH2 = document.createElement("h2");
      nameH2.textContent = member.fullName;
      teamMember.appendChild(nameH2);

      const roleP = document.createElement("p");
      roleP.textContent = member.role;
      teamMember.appendChild(roleP);

      const technologiesDiv = document.createElement("div");
      technologiesDiv.className = "technologies";

      if (member.languages.length > 0) {
        member.languages.forEach((language) => {
          const tech1 = document.createElement("span");
          tech1.className = "technology";
          tech1.textContent = language;
          technologiesDiv.appendChild(tech1);
        });
        teamMember.appendChild(technologiesDiv);
      }

      const socialDiv = document.createElement("div");
      socialDiv.className = "social";

      if (
        member.twitterLink !== "" ||
        member.linkedinLink !== "" ||
        member.githubLink !== ""
      ) {
        teamMember.appendChild(socialDiv);
      }

      if (member.twitterLink !== "") {
        const twitterButton = document.createElement("a");
        twitterButton.href = member.twitterLink;
        twitterButton.className = "socialButton";
        const twitterImg = document.createElement("img");
        twitterImg.src = "/Images/Icons/twitter.svg";
        twitterButton.appendChild(twitterImg);
        socialDiv.appendChild(twitterButton);
      }

      if (member.linkedinLink !== "") {
        const linkedinButton = document.createElement("a");
        linkedinButton.href = member.linkedinLink;
        linkedinButton.className = "socialButton";
        const linkedinImg = document.createElement("img");
        linkedinImg.src = "/Images/Icons/linkedin.svg";
        linkedinButton.appendChild(linkedinImg);
        socialDiv.appendChild(linkedinButton);
      }

      if (member.githubLink !== "") {
        const githubButton = document.createElement("a");
        githubButton.href = member.githubLink;
        githubButton.className = "socialButton";
        const githubImg = document.createElement("img");
        githubImg.src = "/Images/Icons/github.svg";
        githubButton.appendChild(githubImg);
        socialDiv.appendChild(githubButton);
      }
    });
  } else {
    counter.style.display = "none";
    const title = document.createElement("h1");
    title.innerText = "There are no members yet";
    const info = document.createElement("p");
    info.innerText = "Start by adding some members to the GDSC member list.";
    team.appendChild(title);
    team.appendChild(info);
  }
}
