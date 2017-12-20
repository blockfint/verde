// window.addEventListener('load', () => {
  
// });

const verifyButton = document.getElementById('verify');
verifyButton.addEventListener('click', (event) => {
  fetch('/verifyIdentity').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
  });
});