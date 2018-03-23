## Redux Fetch Middleware

Simple Redux API fetch middleware

### Installation

```bash
yarn add @hqro/redux-fetch
```

```js
import { createStore, applyMiddleware, compose } from 'redux'
import fetchMiddleware from '@hqro/redux-fetch'

import reducers from './reducers'

const store = createStore(
  reducers,
  undefined, // Initial state
  compose(
    applyMiddleware(
      fetchMiddleware,
    ),
  ),
)

export default store
```

### Usage

```js
// actions/users.js

const { API_URL } = process.env

const createNewUser = data => ({
  type: '@@FETCH'
})
```
