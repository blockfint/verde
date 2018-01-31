//const socket = io('http://localhost:8080');
const socket = io('/');

let requestId = null;

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');

//const noSelectedIdpAlert = document.getElementById('noSelectedIdpAlert');

const requestIdElement = document.getElementById('requestId');
const statusElement = document.getElementById('status');
const circleLoader = document.getElementsByClassName('circle-loader')[0];
const loaderCheckmark = document.getElementsByClassName('checkmark')[0];

//const idpsElement = document.getElementById('idps');

const verifyButton = document.getElementById('verify');
verifyButton.addEventListener('click', (event) => sendVerifyRequest());

const verifyHideSourceRpButton = document.getElementById('verifyHideSourceRp');
verifyHideSourceRpButton.addEventListener('click', (event) => sendVerifyRequest(true));

/*window.addEventListener('load', () => {
  fetch('/idps')
    .then(response => {
      return response.json();
    })
    .then(json => {
      const idps = json.idps;
      const idpListItems = idps.map(idp => {
        const ele = `<div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="checkbox-${idp.id}" name="idp-${idp.id} data-id="${idp.id}>
          <label class="custom-control-label" for="checkbox-${idp.id}">${idp.name}</label>
        </div>`;
        return ele;
      });
      idpsElement.innerHTML = idpListItems.join('');
    });
});*/

function sendVerifyRequest(hideSourceRp = false) {
  const selectedIdpElements = Array.prototype.slice.call(document.querySelectorAll('#idps input'));
  const selectedIdps = selectedIdpElements.filter(ele => ele.checked === true).map(ele => ele.dataset.id);

  //if (selectedIdps.length > 0) {
    step1.classList.add('d-none');
    step2.classList.remove('d-none');

    statusElement.textContent = 'Waiting for your verification...';
    // statusElement.style = '';

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
  /*} else {
    noSelectedIdpAlert.classList.remove('d-none');
  }*/
}

socket.on('success', (data) => {
  if (data.requestId === requestId) {
    statusElement.textContent = 'Verification Successful!';
    circleLoader.classList.add('load-complete');
    loaderCheckmark.classList.add('draw');
    loaderCheckmark.style = 'display:block;';
  }
});

// TO BE REVISED
socket.on('deny', (data) => {
  if (data.requestId === requestId) {
    statusElement.textContent = 'Verification Failed!';
    circleLoader.classList.add('load-error');
    loaderCheckmark.classList.add('error');
    loaderCheckmark.style = 'display:block;';
  }
});

socket.on('fail', (data) => {
  if (data.requestId === requestId) {
    statusElement.textContent = 'Verification Failed!';
    circleLoader.classList.add('load-error');
    loaderCheckmark.classList.add('error');
    loaderCheckmark.style = 'display:block;';
  }
});
