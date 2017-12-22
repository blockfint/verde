function updateRequestList(json) {
  const list = document.getElementById('list');
  const approved = document.getElementById('approved');
  const denied = document.getElementById('denied');
  json.forEach(function(requestObject) {
    if(!requestObject.processed) addRequest(requestObject,list)
    else {
      let tmpDiv = document.createElement("div");
      var displayData = Object.assign({}, requestObject);
      delete displayData.userId;
      tmpDiv.innerHTML = JSON.stringify(displayData);
      if(requestObject.approved) approved.appendChild(tmpDiv);
      else denied.appendChild(tmpDiv);
    }
  });
}

window.addEventListener('load', () => {
  var userId = window.location.href.split('/');
  userId = userId[userId.length-1];
  fetch('/getList/' + userId).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    updateRequestList(json);
  });
});

function addRequestButton(userId,requestId,action) {
  var buttonElement = document.createElement("button");
  buttonElement.innerHTML = action;
  buttonElement.addEventListener('click', (event) => {
    fetch('/' + action + '/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'requestId=' + requestId + '&userId=' + userId
    }).then((response) => {
      //return response;
      //return response.json();
      window.location.reload();
    }).then((json) => {
      console.log(json);
    });
  });
  return buttonElement;
}

function addRequest(requestObject,divElement) {
  var tmpDiv = document.createElement("div");
  var displayData = Object.assign({}, requestObject);
  delete displayData.userId;
  tmpDiv.innerHTML = JSON.stringify(displayData);
  tmpDiv.appendChild(addRequestButton(requestObject.userId,requestObject.requestId,'approve'));
  tmpDiv.appendChild(addRequestButton(requestObject.userId,requestObject.requestId,'deny'));

  divElement.appendChild(tmpDiv);

}
