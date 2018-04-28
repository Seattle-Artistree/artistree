var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.spotify.com/v1/me/top/artists", false);
xhr.send();

console.log(xhr.status);
console.log(xhr.statusText);