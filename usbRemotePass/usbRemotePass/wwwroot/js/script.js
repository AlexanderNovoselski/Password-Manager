

let _body = document.body;

let enterbtn = document.getElementById('enterBtn');
enterbtn.addEventListener('click', authenticate);

function authenticate() {
    const enteredKey = document.getElementById('key').value;
    const enteredIV = document.getElementById('iv').value;

    if (!enteredKey || !enteredIV) {
        console.error("Key and IV must be provided");
        return; // Exit the function if key or IV is missing
    }

    _body.innerHTML = ''; // Clear the body

    const tableElement = createPasswordManagerDOM(_body);
    fetchDataAndUpdateTable(tableElement, enteredKey, enteredIV);
    let searchBtn = document.getElementById('searchBtn');
    let addBtn = document.getElementById('addBtn');
    searchBtn.addEventListener('click', (e) => searchPassBySite(e));
    addBtn.addEventListener('click', (e) => getPasswordCreaterForm(e));
}


function searchPassBySite(e)
{
    console.log('pass search')
}

function getPasswordCreaterForm(e)
{
    _body.innerHTML = '';
    createPasswordForm(_body);
}




export function addPassword() {
    let web = document.getElementById("titleInput").value;
    let name = document.getElementById("nameInput").value;
    let user = document.getElementById("userInput").value;
    let password = document.getElementById("newPassInput").value;
    let key = document.getElementById("newKeyInput").value;
    let iv = document.getElementById("newIvInput").value;

    let data = {
        web: web,
        name: name,
        user: user,
        password: password,
        key: key,
        iv: iv
    };

    fetch('http://localhost:5000/api/Password/save_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log('Password saved:', data);
        // Perform actions upon successful password save if needed
    })
    .catch(error => {
        console.error('Error saving password:', error);
        // Handle errors
    });
    
}

async function fetchDataAndUpdateTable(table, enteredKey, enteredIV) {
    try {
        const response = await fetch('http://localhost:5000/api/password/get_passwords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: enteredKey, iv: enteredIV })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch passwords');
        }

        const passwords = await response.json();
        populateTable(table, passwords);
    } catch (error) {
        console.error('Error fetching passwords:', error);
    }
}


function populateTable(table, passwords) {
    let id = 1;
    const tableBody = table.createTBody();
    passwords.forEach(password => {
        const row = tableBody.insertRow();
        const cell0 = row.insertCell(); // ID cell
        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        const cell3 = row.insertCell();
        const cell4 = row.insertCell();
        cell0.textContent = id || '';
        cell1.textContent = password.Website || '';
        cell2.textContent = password.Name || '';
        cell3.textContent = password.User || '';
        cell4.textContent = password.Password || '';

        id++;
    });
}

function createPasswordManagerDOM(parentElement) {
    const passwordManagerDiv = document.createElement('div');
    passwordManagerDiv.id = 'passwordManager';

    const title = document.createElement('h2');
    title.textContent = 'Password Manager';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search';
    searchInput.placeholder = 'Search Passwords';

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.id = 'searchBtn';

    const passwordList = document.createElement('ul');
    passwordList.id = 'passwordList';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.id = 'addBtn';

    const table = createTable();
    


    passwordManagerDiv.appendChild(title);
    passwordManagerDiv.appendChild(searchInput);
    passwordManagerDiv.appendChild(searchButton);
    passwordManagerDiv.appendChild(passwordList);
    passwordManagerDiv.appendChild(addButton);
    passwordManagerDiv.appendChild(table);

    // Append the dynamically created elements to the parent element
    parentElement.appendChild(passwordManagerDiv);

    return table;
}

function createTable() {
    const table = document.createElement('table');
    table.id = 'passwordTable';
    table.classList.add('password-table'); // Add a class for further styling

    const tableHeader = table.createTHead();
    const headerRow = tableHeader.insertRow();
    const headers = ['ID', 'Website', 'Name', 'User', 'Password'];
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    return table;
}

function createPasswordForm(bodyElement) {
    const passwordFormDiv = document.createElement('div');
    passwordFormDiv.id = 'passwordForm';
  
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Website: ';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'titleInput';
  
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name: ';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'nameInput';
  
    const userLabel = document.createElement('label');
    userLabel.textContent = 'Username: ';
    const userInput = document.createElement('input');
    userInput.type = 'text';
    userInput.id = 'userInput';
  
    const passLabel = document.createElement('label');
    passLabel.textContent = 'Password: ';
    const passInput = document.createElement('input');
    passInput.type = 'password';
    passInput.id = 'newPassInput';

    const key = document.createElement('label');
    key.textContent = 'Key: ';
    const keyInput = document.createElement('input');
    keyInput.type = 'password';
    keyInput.id = 'newKeyInput';

    const iv = document.createElement('label');
    iv.textContent = 'Iv: ';
    const ivInput = document.createElement('input');
    ivInput.type = 'password';
    ivInput.id = 'newIvInput';
  
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = addPassword;
  
    passwordFormDiv.appendChild(titleLabel);
    passwordFormDiv.appendChild(titleInput);
    passwordFormDiv.appendChild(document.createElement('br'));
    passwordFormDiv.appendChild(nameLabel);
    passwordFormDiv.appendChild(nameInput);
    passwordFormDiv.appendChild(document.createElement('br'));
    passwordFormDiv.appendChild(userLabel);
    passwordFormDiv.appendChild(userInput);
    passwordFormDiv.appendChild(document.createElement('br'));
    passwordFormDiv.appendChild(passLabel);
    passwordFormDiv.appendChild(passInput);
    passwordFormDiv.appendChild(document.createElement('br'));
    passwordFormDiv.appendChild(key);
    passwordFormDiv.appendChild(keyInput);
    passwordFormDiv.appendChild(document.createElement('br'));
    passwordFormDiv.appendChild(iv);
    passwordFormDiv.appendChild(ivInput);
    passwordFormDiv.appendChild(document.createElement('br'));
    passwordFormDiv.appendChild(saveButton);
  
    bodyElement.appendChild(passwordFormDiv);
  }

