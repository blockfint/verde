const socket = io('http://localhost:8080');

let requestId = null;

const requestIdElement = document.getElementById('requestId');
const statusElement = document.getElementById('status');
const idpsElement = document.getElementById('idps');

const verifyButton = document.getElementById('verify');
verifyButton.addEventListener('click', (event) => sendVerifyRequest());

const verifyHideSourceRpButton = document.getElementById('verifyHideSourceRp');
verifyHideSourceRpButton.addEventListener('click', (event) => sendVerifyRequest(true));

window.addEventListener('load', () => {
  fetch('/idps')
    .then(response => {
      return response.json();
    })
    .then(json => {
      const idps = json.idps;
      const idpListItems = idps.map(idp => {
        const ele = `<div>
          <span>${idp.name}</span>
          <input type="checkbox" name="idp-${idp.id}" data-id="${idp.id}">
        </div>`;
        return ele;
      });
      idpsElement.innerHTML = idpListItems.join('');
    });
});

function sendVerifyRequest(hideSourceRp = false) {
  const selectedIdpElements = Array.prototype.slice.call(document.querySelectorAll('#idps input'));
  const selectedIdps = selectedIdpElements.filter(ele => ele.checked === true).map(ele => ele.dataset.id);

  if (selectedIdps.length > 0) {
    statusElement.textContent = 'Pending...';
    statusElement.style = '';

    fetch('/verifyIdentity', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedIdps: selectedIdps,
        hideSourceRp: hideSourceRp,
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        requestId = json.requestId;
        requestIdElement.textContent = 'Request ID: ' + requestId;
      });
  } else {
    statusElement.textContent = 'Please select at least one IDP';
    statusElement.style = '';
  }
}

socket.on('success', (data) => {
  if (data.requestId === requestId) {
    statusElement.textContent = 'Success!';
  }
});

socket.on('fail', (data) => {
  if (data.requestId === requestId) {
    statusElement.textContent = 'Failed!';
  }
});