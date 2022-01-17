# The-Game-Of-Life-API

## Links:

<a href="">The Game Of Life API</a> RapidAPI Link.

<a href="https://github.com/timjacksonm/rle-decoder">**rle-decoder**</a>

## Usage:

Query up to 2,339 unique patterns that are well documented or save a new pattern to the database.

API returns a JavaScript object that include the patterns Author, Title, Description, Size & Run length encoded string!

Use my npm package <a href="https://github.com/timjacksonm/rle-decoder">**rle-decoder**</a> to decode the **rle string** into a two-dimensional array that you can use in your own project.

The API allows you to subscribe and use up to 6 different endpoints to query data from the database.

## API:

Sign up / Sign at <a href="https://rapidapi.com/">rapidapi.com</a>

Navigate to API Hub and search The Game Of Life API or click <a href="">here</a>.

Results returned from API are formatted with the below Schema.

<details>
  <summary>Schema</summary>
  
  ```javascript
  {
	"type": "array",
	"items": {
		"type": "object",
		"properties": {
			"_id": {
				"type": "string"
			},
			"author": {
				"type": "string"
			},
			"title": {
				"type": "string"
			},
			"description": {
				"type": "array"
			},
			"size": {
				"type": "object",
				"properties": {
					"x": {
						"type": "integer"
					},
					"y": {
						"type": "integer"
					}
				}
			},
			"rleString": {
				"type": "string"
			},
			"date": {
				"type": "string"
			}
		}
	}
}
```
  
</details>

The below examples uses axios for request to the api.

<details>
  <summary>GET patterns from wikicollection</summary>

Results are sorted by size small -> large
  
If parameters are omitted API will return 10 results by default.
  
Optional parameters **count** and **select** can be added to change query results.

{ count: Number } - if included returns the Number of results you want returned. from 1 to a max range of 2,339 patterns.

{ select: JSON String } - if included returns only the fields listed within the Array of Strings in JSON format. I.E. { select: '["author", "rleString"]' }
fields you can include are _id, author, title, description, size, rleString, date

**Example Request**
  
```javascript
var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://the-game-of-life.p.rapidapi.com/wikicollection/patterns/',
  params: {
    select: '["author","title","description","size","rleString","date"]',
    count: '1'
  },
  headers: {
    'x-rapidapi-host': 'the-game-of-life.p.rapidapi.com',
    'x-rapidapi-key': 'Your API-Key Here'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});
```
  
**Example Response**

  ```javascript
{
    "size": {
        "x": 11,
        "y": 11
    },
    "_id": "61de589cbec647f794843b51",
    "author": "",
    "title": "Scrubber with blocks",
    "description": [],
    "rleString": "4b2o$4b2o2$4b3o$3bo3bob2o$2obo3bob2o$2obo3bo$4b3o2$5b2o$5b2o!",
    "date": "2022-01-12T04:27:08.057Z"
}
```
  
  
</details>

<details>
  <summary>GET wikicollection pattern by :id</summary>

If parameters are omitted API will return result with all fields by default.

Optional parameter **select** can be added to change query results.

{ select: JSON String } - if included returns only the fields listed within the Array of Strings in JSON format. I.E. { select: '["author", "rleString"]' }
fields you can include are _id, author, title, description, size, rleString, date

**Example Request**
  
```javascript
var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://the-game-of-life.p.rapidapi.com/wikicollection/patterns/61de589bbec647f7948435ef',
  params: {select: '["author","title","description","size","rleString","date"]'},
  headers: {
    'x-rapidapi-host': 'the-game-of-life.p.rapidapi.com',
    'x-rapidapi-key': 'Your API-Key Here'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});
```
  
**Example Response**

  ```javascript
{
    "size": {
        "x": 12,
        "y": 5
    },
    "_id": "61de589bbec647f7948435ef",
    "author": "Dean Hickerson",
    "title": "Blom",
    "description": [
        "A methuselah with lifespan 23314 found in July 2002.",
        "www.conwaylife.com/wiki/index.php?title=Blom"
    ],
    "rleString": "o10bo$b4o6bo$2b2o7bo$10bob$8bobo!",
    "date": "2022-01-12T04:27:07.819Z"
}
```

</details>

<details>
  <summary>GET all wikicollection patterns by title or author search</summary>

Required parameters: path which is the directory to filter. Can be title or author.
  
Required query: value which is the search query.

If parameters are omitted API will return 10 results by default.
  
Optional parameters **count** and **select** can be added to change query results.

{ count: Number } - if included returns the Number of results you want returned. from 1 to a max range of 2,339 patterns.

{ select: JSON String } - if included returns only the fields listed within the Array of Strings in JSON format. I.E. { select: '["author", "rleString"]' }
fields you can include are _id, author, title, description, size, rleString, date

**Example Request**
  
```javascript
var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://the-game-of-life.p.rapidapi.com/wikicollection/search/title',
  params: {
    value: 'cloverleaf',
    select: '["author","title","description","size","rleString","date"]',
    count: '1'
  },
  headers: {
    'x-rapidapi-host': 'the-game-of-life.p.rapidapi.com',
    'x-rapidapi-key': 'Your API-Key Here'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});
```
  
**Example Response**

  ```javascript
[
    {
        "_id": "61de589bbec647f7948436e8",
        "author": "Adam P. Goucher",
        "title": "Cloverleaf interchange",
        "description": [
            "https://conwaylife.com/wiki/Cloverleaf_interchange",
            "https://conwaylife.com/patterns/cloverleafinterchange.rle"
        ],
        "size": {
            "x": 13,
            "y": 13
        },
        "rleString": "4bo3bo$3bobobobo$3bobobobo$b2o2bobo2b2o$o4bobo4bo$b4o3b4o2$b4o3b4o$o4bobo4bo$b2o2bobo2b2o$3bobobobo$3bobobobo$4bo3bo!",
        "date": "2022-01-12T04:27:07.876Z"
    }
]
```
  
</details>

<details>
  <summary>GET patterns from customcollection</summary>

**Custom Collection contains patterns saved from my Game Of Life Application. May be few results.**  
  
Results are sorted by size small -> large
  
If parameters are omitted API will return 10 results by default.
  
Optional parameters **count** and **select** can be added to change query results.

{ count: Number } - if included returns the Number of results you want returned. from 1 to a max range of 2,339 patterns.

{ select: JSON String } - if included returns only the fields listed within the Array of Strings in JSON format. I.E. { select: '["author", "rleString"]' }
fields you can include are _id, author, title, description, size, rleString, date

**Example Request**
  
```javascript
var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://the-game-of-life.p.rapidapi.com/customcollection/patterns/',
  params: {
    select: '["author","title","description","size","rleString","date"]',
    count: '1'
  },
  headers: {
    'x-rapidapi-host': 'the-game-of-life.p.rapidapi.com',
    'x-rapidapi-key': 'Your API-Key Here'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});

```
  
**Example Response**

  ```javascript
[
    {
        "_id": "61e3651ab423cd99aee24876",
        "author": "Tim",
        "title": "epic pattern",
        "description": [
            "flys across the room in a crazy pattern you would not believe!"
        ],
        "size": {
            "x": 3,
            "y": 3
        },
        "rleString": "bo$2bo$3o!",
        "date": "2022-01-16T00:21:46.698Z"
    }
]
```
</details>

<details>
  <summary>GET customcollection pattern by :id</summary>
  
**Custom Collection contains patterns saved from my Game Of Life Application. May be few results.**  

If parameters are omitted API will return result with all fields by default.

Optional parameter **select** can be added to change query results.

{ select: JSON String } - if included returns only the fields listed within the Array of Strings in JSON format. I.E. { select: '["author", "rleString"]' }
fields you can include are _id, author, title, description, size, rleString, date

**Example Request**
  
```javascript
var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://the-game-of-life.p.rapidapi.com/customcollection/patterns/61e3651ab423cd99aee24876',
  params: {select: '["author","title","description","size","rleString","date"]'},
  headers: {
    'x-rapidapi-host': 'the-game-of-life.p.rapidapi.com',
    'x-rapidapi-key': 'Your API-Key Here'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});

```
  
**Example Response**

```javascript
  {
    "size": {
        "x": 3,
        "y": 3
    },
    "_id": "61e3651ab423cd99aee24876",
    "author": "Tim",
    "title": "epic pattern",
    "description": [
        "flys across the room in a crazy pattern you would not believe!"
    ],
    "rleString": "bo$2bo$3o!",
    "date": "2022-01-16T00:21:46.698Z"
}

```
  
</details>

</details>

<details>
  <summary>POST save new pattern to customcollection</summary>



**Example Request**
  
```javascript
var axios = require("axios").default;

var options = {
  method: 'POST',
  url: 'https://the-game-of-life.p.rapidapi.com/customcollection/patterns/',
  headers: {
    'content-type': 'application/json',
    'x-rapidapi-host': 'the-game-of-life.p.rapidapi.com',
    'x-rapidapi-key': 'Your API-Key Here'
  },
  data: {
    author: 'Test',
    title: 'glider',
    description: ['default glider'],
    size: {x: 3, y: 3},
    rleString: 'bob$2bo$3o!'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});
```
  
**Example Successful Response Code 201**

```javascript
{
    "author": "Test",
    "title": "glider",
    "description": [
        "default glider"
    ],
    "size": {
        "x": 3,
        "y": 3
    },
    "rleString": "bo$2bo$3o!",
    "_id": "61e5057e79afeb37385511bb",
    "date": "2022-01-17T05:58:22.888Z",
    "__v": 0
}
```
  
**Example Bad Request Response Code 400**

```javascript
{
    "message": {
        "errors": [
            {
                "value": "assdf",
                "msg": "Title already in use",
                "param": "title",
                "location": "body"
            }
        ]
    }
}
```
  
</details>

## Release

-v 1.0.0 first release version with updated readme.

Please submit all issues via rapidapi contact api creator link or on repository.

Thank you
