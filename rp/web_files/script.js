// window.addEventListener('load', () => {
  
// });

const socket = io('http://localhost:8080');

let requestId = null;

const requestIdElement = document.getElementById('requestId');
const statusElement = document.getElementById('status');

const verifyButton = document.getElementById('verify');
verifyButton.addEventListener('click', (event) => {
  statusElement.textContent = 'Pending...';
  statusElement.style = '';
  fetch('/verifyIdentity').then((response) => {
    return response.json();
  }).then((json) => {
    requestId = json.requestId;
    requestIdElement.textContent = 'Request ID: ' + requestId;
  });
});

const verifyHideSourceRpButton = document.getElementById('verifyHideSourceRp');
verifyHideSourceRpButton.addEventListener('click', (event) => {
  statusElement.textContent = 'Pending...';
  statusElement.style = '';
  fetch('/verifyIdentity?hideSourceRp=true').then((response) => {
    return response.json();
  }).then((json) => {
    requestId = json.requestId;
    requestIdElement.textContent = 'Request ID:' + requestId;
  });
});

socket.on('success', function(data){
  if (data.requestId === requestId) {
    statusElement.textContent = 'Success!';
  }
});

socket.on('fail', function(data){
  if (data.requestId === requestId) {
    statusElement.textContent = 'Failed!';
  }
});