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

socket.on('success', function(data){
  if (parseInt(data.requestId) === requestId) {
    status.textContent = 'Success!';
    requestId = null;
  }
});

socket.on('fail', function(data){
  if (parseInt(data.requestId) === requestId) {
    status.textContent = 'Failed!';
    requestId = null;
  }
});