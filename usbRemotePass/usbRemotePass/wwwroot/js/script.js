import { createPasswordForm, createPasswordManagerDOM, populateTable } from "./domUtils.js";
window.addEventListener('beforeunload', () => {
    // Clear session storage when the page is about to unload
    sessionStorage.clear();
});

let _body = document.body;

let enterbtn = document.getElementById('enterBtn');
enterbtn.addEventListener('click', authenticate);


function authenticate() {
    const enteredKey = document.getElementById('key').value;
    const enteredIV = document.getElementById('iv').value;

    let keyError = document.getElementById('keyError');
    let ivError = document.getElementById('ivError');

    if (!enteredKey || !enteredIV) {
        console.error("Key and IV must be provided");
        keyError.style.display = 'block';
        ivError.style.display = 'block';
        return; // Exit the function if key or IV is missing
    }

    sessionStorage.setItem('key', enteredKey)
    sessionStorage.setItem('iv', enteredIV)
    _body.innerHTML = '';

    showPasswordsTable();
}

function showPasswordsTable() {
    const tableElement = createPasswordManagerDOM(_body);

    tableElement.addEventListener('click', (event) => copyToClickboard(event));

    fetchDataAndUpdateTable(tableElement, sessionStorage.getItem('key'), sessionStorage.getItem('iv'));
    let addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', (e) => getPasswordCreaterForm(e));
}

function copyToClickboard (event) {
    const targetCell = event.target;

    // Check if the clicked element is a cell (td)
    if (targetCell.tagName === 'TD') {
        const copiedContent = targetCell.textContent;

        // Copy the content to the clipboard
        navigator.clipboard.writeText(copiedContent)
            .then(() => {
                console.log('Content copied to clipboard:', copiedContent);

                targetCell.classList.add('glow');

                setTimeout(() => {
                    targetCell.classList.remove('glow');
                }, 1000);
            })
            .catch(error => {
                console.error('Error copying content to clipboard:', error);
            });
    }
}

function getPasswordCreaterForm(e) {
    _body.innerHTML = '';
    createPasswordForm(_body);
    let saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', (e) => addPassword(e))
}

function addPassword(e) {
    e.preventDefault();
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
        })
        .then(data => {
            console.log('Password saved:', data);
            _body.innerHTML = '';
            showPasswordsTable();
        })
        .catch(error => {
            console.error('Error saving password:', error);
        });

}

// Function to fetch data and update the table
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