const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const mobileInput = document.querySelector('#mobile');
const emailInput = document.querySelector('#email');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#users');

// Listen for form submit
myForm.addEventListener('submit', onSubmit);
userList.addEventListener('click', handleUserAction);

let users = [];

// Function to handle form submission
function onSubmit(e) {
  e.preventDefault();

  if (nameInput.value === '' || emailInput.value === '') {
    msg.classList.add('error');
    msg.innerHTML = 'Please enter all fields';
    setTimeout(() => msg.remove(), 3000);
  } else {
    const user = {
      name: nameInput.value,
      email: emailInput.value,
      mobile: mobileInput.value
    };
    axios.post("https://crudcrud.com/api/625492458b9049d7a8b930f182320e1e/bokingapp",user)
    .then((Response)=> {
      displayUsers(Response.data)
    })
    .catch((err) => {
      document.body.innerHTML = document.body.innerHTML + "<h4>Somthing went wrong<h4>"
      console.log(err);
    })

    const storedData = localStorage.getItem('userData');
    users = storedData ? JSON.parse(storedData) : [];

    if (!Array.isArray(users)) {
      users = [];
    }
   
    users.push(user);

    localStorage.setItem('userData', JSON.stringify(users));

    displayUsers(users);

    nameInput.value = '';
    emailInput.value = '';
  }
}

// Function to display users
function displayUsers(users) {
  userList.innerHTML = ''; // Clear existing list items

  users.forEach((user, index) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`${user.name}: ${user.email}: ${user.mobile}`));

    // Create edit button for each user entry
    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = 'Edit';
    editButton.dataset.index = index;

    // Create delete button for each user entry
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.index = index;

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    userList.appendChild(li);
  });
}

// Function to handle user actions (edit/delete)
function handleUserAction(e) {
  if (e.target.classList.contains('edit-btn')) {
    const userIndex = e.target.dataset.index;
    const user = users[userIndex];

    // Update the email input with the user's current email address
    emailInput.value = user.email;

    // Remove the user from the array (to be re-added with updated email)
    users.splice(userIndex, 1);

    // Update LocalStorage
    localStorage.setItem('userData', JSON.stringify(users));

    // Re-display the users
    displayUsers(users);
  } else if (e.target.classList.contains('delete-btn')) {
    const userIndex = e.target.dataset.index;

    // Remove the user from the array
    users.splice(userIndex, 1);

    // Update LocalStorage
    localStorage.setItem('userData', JSON.stringify(users));

    // Re-display the users
    displayUsers(users);
  }
}

// Perform operations after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const storedData = localStorage.getItem('userData');
  users = storedData ? JSON.parse(storedData) : [];

  if (!Array.isArray(users)) {
    users = [];
  }

  displayUsers(users);
});
