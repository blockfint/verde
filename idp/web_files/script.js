window.addEventListener('load', () => {
  fetch('/getList').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
  });
});

const approveButton = document.getElementById('approveButton');
approveButton.addEventListener('click', (event) => {
  fetch('/approve').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
  });
});