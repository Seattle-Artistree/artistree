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

// this is a very critical part of your code.
// you will need to carefully insert new artists that you fetch from API
// in this
var allArtists = [
  { id: '000001',
    name: 'Jain',
    image: 'blah blah blah',
    children: [  
      { 
        id: '000002',
        name: 'Jameele',
        image: 'jajajajaja',
        children: []
      },
      { 
        id: '000003',
        name: 'Janis',
        image: 'khakhakhakha',
        children: []
      }
    ]
  }
];
function Artist(id, name, image, children) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.children = {};
}
console.log(api_response.items[0].images[0].url);

Artist.prototype.responseToObject = function(response) {
  this.id = response.items[0].id;
  this.name = response.items[0].name;
  this.image = response.items[0].images[0].url;
};
// when we make a call for RELATED artist
