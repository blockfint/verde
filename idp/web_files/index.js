const pendingList = document.getElementById('pendingList');
const approvedList = document.getElementById('approved');
const deniedList = document.getElementById('denied');
const loadingIndicators = document.getElementsByClassName('loading-indicator');
const socket = io('/')

socket.on('fetch', (data) => {
  fetchAndupdateRequestList();
});
window.addEventListener('load',fetchAndupdateRequestList);

function fetchAndupdateRequestList() {
  var userId = window.location.href.split('/');
  userId = userId[userId.length-1];
  if(!userId) window.location = '/home/1100023145268';
  fetch('/getRequestList/' + userId).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    hideLoadingIndicators();
    updateRequestList(json);
  }).catch(function(error) {
    console.error(error);
  });
}

function hideLoadingIndicators() {
  Array.prototype.forEach.call(loadingIndicators, (ele) => {
    ele.style = 'display:none;';
  });
}

function clearRequestList() {
  while(pendingList.firstChild)
    pendingList.removeChild(pendingList.firstChild);
  while(approvedList.firstChild)
    approvedList.removeChild(approvedList.firstChild);
  while(deniedList.firstChild)
    deniedList.removeChild(deniedList.firstChild);
}

function updateRequestList(jsonRequests) {
  clearRequestList();
  for(var type in jsonRequests) {
    let json = jsonRequests[type]; 
    if (Array.isArray(json)) {
      if (json.length > 0) {
        json.forEach(function(requestObject) {
          if(type !== 'pending') {
            requestObject.processed = true;
            requestObject.approved = (type === 'approved');
          }
          const listItem = createListItem(requestObject);

          if (!requestObject.processed) {
            pendingList.appendChild(listItem);
          } else {
            if (requestObject.approved) {
              approvedList.appendChild(listItem);
            } else {
              deniedList.appendChild(listItem);
            }
          }
        });
      }
    }
  }

  if (pendingList.children.length === 0) {
    pendingList.appendChild(createEmptyTextListItem());
  }
  if (approvedList.children.length === 0) {
    approvedList.appendChild(createEmptyTextListItem());
  }
  if (deniedList.children.length === 0) {
    deniedList.appendChild(createEmptyTextListItem());
  }
}

function createListItem(requestObject) {
  let li = document.createElement('li');
  li.classList.add('list-group-item');
  li.classList.add('request-list-item');
  // let displayData = Object.assign({}, requestObject);
  // delete displayData.userId;

  let infoDiv = document.createElement('div');
  infoDiv.classList.add('request-info');
  infoDiv.innerHTML = `<div>Request ID: ${requestObject.requestId}</div>
    <div>RP Address: ${requestObject.rpAddress}</div>
    <div>User Address: ${requestObject.userAddress}</div>
    <div>Data: ${requestObject.data}</div>`;
  li.appendChild(infoDiv);

  let buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('request-buttons');
  li.appendChild(buttonsDiv);

  if (!requestObject.processed) {
    buttonsDiv.appendChild(
      createRequestButton(requestObject.userId, requestObject.requestId, 'approve')
    );
    buttonsDiv.appendChild(
      createRequestButton(requestObject.userId, requestObject.requestId, 'deny')
    );
  }
  return li;
}

function createEmptyTextListItem() {
  let li = document.createElement('li');
  li.classList.add('list-group-item');

  li.textContent = 'No items';

  return li;
}

function createRequestButton(userId, requestId, action) {
  var buttonElement = document.createElement('button');
  buttonElement.type = 'button';
  buttonElement.classList.add('btn');
  buttonElement.classList.add('btn-block');
  if (action === 'approve') {
    buttonElement.classList.add('btn-success');
    buttonElement.textContent = 'Approve';
  } else if (action === 'deny') {
    buttonElement.classList.add('btn-danger');
    buttonElement.textContent = 'Deny';
  }
  buttonElement.addEventListener('click', event => {
    fetch('/' + action + '/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'requestId=' + requestId + '&userId=' + userId,
    })
      .then(response => {
        //return response;
        //return response.json();
        //window.location.reload();
        fetchAndupdateRequestList();
      })
      .then(json => {
        console.log(json);
      });
  });
  return buttonElement;
}
