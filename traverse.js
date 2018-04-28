var api_response = {
  "items" : [ {
    "external_urls" : {
      "spotify" : "https://open.spotify.com/artist/2HHmvvSQ44ePDH7IKVzgK0"
    },
    "followers" : {
      "href" : null,
      "total" : 183897
    },
    "genres" : [ ],
    "href" : "https://api.spotify.com/v1/artists/2HHmvvSQ44ePDH7IKVzgK0",
    "id" : "2HHmvvSQ44ePDH7IKVzgK0",
    "images" : [ {
      "height" : 640,
      "url" : "https://i.scdn.co/image/6e4d8ba95cb31c0475179d55c2af4760136d304f",
      "width" : 640
    }, {
      "height" : 320,
      "url" : "https://i.scdn.co/image/5a58191e3f4639d13fc1836b748620bca88c9941",
      "width" : 320
    }, {
      "height" : 160,
      "url" : "https://i.scdn.co/image/91826972726ff820dd177b7d4a9d4e06cb87bd23",
      "width" : 160
    } ],
    "name" : "Jain",
    "popularity" : 62,
    "type" : "artist",
    "uri" : "spotify:artist:2HHmvvSQ44ePDH7IKVzgK0"
  } ],
  "total" : 50,
  "limit" : 1,
  "offset" : 0,
  "previous" : null,
  "href" : "https://api.spotify.com/v1/me/top/artists?limit=1&offset=0",
  "next" : "https://api.spotify.com/v1/me/top/artists?limit=1&offset=1"
};

function Artist(picture, name, id) {
  this.picture = picture;
  this.name = name;
  this.id = id;
}

Artist.prototype.responseToObject = function(response) {
  
}