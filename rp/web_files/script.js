// window.addEventListener('load', () => {
  
// });

const socket = io('http://localhost:8080');

let requestId = null;

const status = document.getElementById('status');

const verifyButton = document.getElementById('verify');
verifyButton.addEventListener('click', (event) => {
  status.textContent = 'Pending...';
  status.style = '';
  fetch('/verifyIdentity').then((response) => {
    return response.json();
  }).then((json) => {
    requestId = json.requestId;
  });
});

const verifyHideSourceRpButton = document.getElementById('verifyHideSourceRp');
verifyHideSourceRpButton.addEventListener('click', (event) => {
  status.textContent = 'Pending...';
  status.style = '';
  fetch('/verifyIdentity?hideSourceRp=true').then((response) => {
    return response.json();
  }).then((json) => {
    requestId = json.requestId;
  });
});

socket.on('success', function(data){
  if (data.requestId === requestId) {
    status.textContent = 'Success!';
    requestId = null;
  }
});

socket.on('fail', function(data){
  if (data.requestId === requestId) {
    status.textContent = 'Failed!';
    requestId = null;
  }
});