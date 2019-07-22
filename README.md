# ZSSN - Zombie Survival Social Network

## Start up

Prerequisites:

```
MongoDB
NodeJS
yarn
```

Starting...

```
yarn install
npm start
```

Server listining on **http://localhost:5000**

## API

### POST /survivors

```
POST /survivors
Content-Type: "application/json"

{
  "name": "Joaquin",
  "age": 70,
  "gender": "M",
  "latitude": 17.2345678,
  "longitude": -17.1234567,
  "water": 17,
  "ammunition": 5
}
```

##### Returns:

```
200 OK
Content-Type: "application/json"

{
  "__v": 0,
  "name": "Joaquin",
  "age": 70,
  "gender": "M",
  "latitude": 17.2345678,
  "longitude": -17.1234567,
  "_id": "5d31276bdee70b6e580dd2ef",
  "ammunition": {
    "amount": 5,
    "points": 5
  },
  "medication": {
    "amount": 0,
    "points": 0
  },
  "food": {
    "amount": 0,
    "points": 0
  },
  "water": {
    "amount": 17,
    "points": 56
  },
  "isInfected": false,
  "contamination_counter": 0
}
```

##### Errors:

| Error | Description                                                             |
| ----- | ----------------------------------------------------------------------- |
| 400   | The server couldn't save your request + (the specific validation error) |

### GET /survivors

#### Returns

```
200 OK
Content-Type: "application/json"

[
  {
  "__v": 0,
  "name": "Joaquin",
  "age": 70,
  "gender": "M",
  "latitude": 17.2345678,
  "longitude": -17.1234567,
  "_id": "5d31276bdee70b6e580dd2ef",
  "ammunition": {
    "amount": 5,
    "points": 5
  },
  "medication": {
    "amount": 0,
    "points": 0
  },
  "food": {
    "amount": 0,
    "points": 0
  },
  "water": {
    "amount": 17,
    "points": 56
  },
  "isInfected": false,
  "contamination_counter": 0
},
  {
    "_id": "5d2fe9dd262dd247bcd6f264",
    "name": "Tião",
    "age": 40,
    "gender": "M",
    "latitude": 38.89511,
    "longitude": -77.03637,
    "__v": 0,
    "ammunition": {
      "amount": 1,
      "points": 1
    },
    "medication": {
      "amount": 0,
      "points": 0
    },
    "food": {
      "amount": 0,
      "points": 0
    },
    "water": {
      "amount": 10,
      "points": 40
    },
    "isInfected": false,
    "contamination_counter": 0
  }
]
```

### GET /survivors/:id

| Attribute | Description |
| --------- | ----------- |
| id        | Survivor ID |

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "__v": 0,
  "name": "Joaquin",
  "age": 70,
  "gender": "M",
  "latitude": 17.2345678,
  "longitude": -17.1234567,
  "_id": "5d31276bdee70b6e580dd2ef",
  "ammunition": {
    "amount": 5,
    "points": 5
  },
  "medication": {
    "amount": 0,
    "points": 0
  },
  "food": {
    "amount": 0,
    "points": 0
  },
  "water": {
    "amount": 17,
    "points": 56
  },
  "isInfected": false,
  "contamination_counter": 0
}
```

##### Errors

| Error | Description        |
| ----- | ------------------ |
| 404   | Survivor Not Found |

### PATCH /survivors/:id

```
PATCH /survivors/:id
Content-Type: "application/json"

{
    "latitude": 10,
    "longitude": 10
}
```

| Attribute | Description |
| --------- | ----------- |
| id        | Survivor ID |

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "__v": 0,
  "name": "Joaquin",
  "age": 70,
  "gender": "M",
  "latitude": 10,
  "longitude": 10,
  "_id": "5d31276bdee70b6e580dd2ef",
  "ammunition": {
    "amount": 5,
    "points": 5
  },
  "medication": {
    "amount": 0,
    "points": 0
  },
  "food": {
    "amount": 0,
    "points": 0
  },
  "water": {
    "amount": 17,
    "points": 56
  },
  "isInfected": false,
  "contamination_counter": 0
}
```

##### Errors

| Error | Description                                                             |
| ----- | ----------------------------------------------------------------------- |
| 400   | The server couldn't save your request + (the specific validation error) |
| 404   | Survivor Not Found                                                      |

### POST /contamination

```
POST /contamination
Content-Type: "application/json"

{
  "reporter_id": "5d2fe9e6262dd247bcd6f265",
  "reportee_id": "5d2fd9d67cb1e7359b7ce131"
}
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "message": "Contamination reported successfully"
}
```

##### Errors

| Error | Description                               |
| ----- | ----------------------------------------- |
| 400   | You can't report yourself as infected.    |
| 400   | You can't report the same survivor twice. |
| 404   | Survivor not found.                       |

### POST /trades

```
POST /trades
Content-Type: "application/json"

{
   "trader_1_id": "5d2fe9e6262dd247bcd6f265",
   "trader_2_id": "5d31276bdee70b6e580dd2ef",
   "trader_1_resources": [
        {
            "item": "ammunition",
            "amount": 1
        },
        {
            "item": "water",
            "amount": 2
        }
    ],
    "trader_2_resources": [
        {
            "item": "ammunition",
            "amount": 9
        }
    ]
}
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "message": "Trade complete successfully."
}
```

##### Errors

| Error | Description                                                   |
| ----- | ------------------------------------------------------------- |
| 400   | The server can't save your request + (Trade validation error) |
| 400   | Trade requires two different survivors                        |

|
| 400 | Both survivors must offer the same amount of points
|
| 400 | Trader is infected
|
| 400 | Trader does not have enough resource for this transation
|
| 404 | Trader not found
|

### GET /reports/infected

```
GET /reports/infected
Content-Type: "application/json"
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "infected": "20.00%"
}
```

### GET /reports/noninfected

```
GET /reports/noninfected
Content-Type: "application/json"
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "non_infected": "80.00%"
}
```

### GET /reports/averageresources

```
GET /reports/averageresources
Content-Type: "application/json"
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "water": 8.2,
  "food": 0,
  "medication": 0,
  "ammunition": 4.4
}
```

### GET /reports/lostpoints

```
GET /reports/lostpoints
Content-Type: "application/json"
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "lost_points": 41
}
```
