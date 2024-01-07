
export function populateTable(table, passwords) {
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
        cell4.textContent = password.Password || '';

        id++;
    });
}

export function createPasswordManagerDOM(parentElement) {
    const passwordManagerDiv = document.createElement('div');
    passwordManagerDiv.id = 'passwordManager';

    const title = document.createElement('h2');
    title.textContent = 'Password Manager';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.id = 'addBtn';

    const table = createTable();

    passwordManagerDiv.appendChild(title);
    passwordManagerDiv.appendChild(addButton);
    passwordManagerDiv.appendChild(table);

    // Append the dynamically created elements to the parent element
    parentElement.appendChild(passwordManagerDiv);

    return table;
}

function createTable() {
    const table = document.createElement('table');
    table.id = 'passwordTable';
    table.classList.add('password-table');


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

export function createPasswordForm(bodyElement) {
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
    saveButton.id = 'saveBtn';
    saveButton.textContent = 'Save';

    const backButton = document.createElement('button');
    backButton.id = 'backBtn';
    backButton.textContent = 'Back';
    
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
    passwordFormDiv.appendChild(backButton);    
  
    bodyElement.appendChild(passwordFormDiv);
  }