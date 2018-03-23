## Redux Request Middleware

Simple Redux API request middleware

### Installation

```bash
yarn add @hqro/redux-request
```

```js
import { createStore, applyMiddleware, compose } from 'redux'
import requestMiddleware from '@hqro/redux-request'

import reducers from './reducers'

const store = createStore(
  reducers,
  undefined, // Initial state
  compose(
    applyMiddleware(
      requestMiddleware,
    ),
  ),
)

export default store
```

### Usage

```js
// actions/users.js
const { API_URL } = process.env

const fetchAllUsers = token => ({
  type: '@@REQUEST/FETCH_ALL_USERS',
  url: `${API_URL}/users`,
  headers: { Authorization: token },
})

const createUser = data => ({
  type: '@@REQUEST/CREATE_USER',
  method: 'POST',
  url: `${API_URL}/user`,
  body: JSON.stringify(data),
  onSuccess: () => console.log('User created !'),
  onError: e => console.error(e),
})
```

### Using Redux-Thunk

```js
// actions/users.js
const { API_URL } = process.env

const fetchAllUsers = (token, retries = 2) =>
	async dispatch => dispatch({
		type: '@@REQUEST/FETCH_ALL_USERS',
		url: `${API_URL}/users`,
		headers: { Authorization: token },
		onError: () =>
			retries && dispatch(fetchAllUsers(token, retries - 1)),
	})
```
