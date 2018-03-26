const extractBody = response => {
  const ctype = response.headers.get('content-type')

  if (ctype && ctype.includes('application/json'))
    return response.json()

  return response.text()
}

const requestMiddleware = ({ getState }) => dispatch =>
  ({ type, url, method = 'GET', body, onSuccess, onError, ...action }) => {
    const state = getState()
    const headers = {
      'Content-Type': 'application/json',
      ...action.headers || {},
    }

    if (!type || !url || !type.includes('@@REQUEST/'))
      return dispatch(action)

    dispatch({ type: `${type}_PENDING` })

    fetch(url, { method, headers, body })
      .then(extractBody)
      .then(data => dispatch({
        type: `${type}_SUCCESS`,
        payload: { data, error: null },
        ...action,
      }))
      .then(() => {
        if (onSuccess)
          return onSuccess(body, state)
      })
      .catch(({ message }) => {
        const error = JSON.parse(message)

        dispatch({
          type: `${type}_ERROR`,
          payload: { data: null, error },
        })

        if (onError)
          return onError(error, state)
      })
  }

export default requestMiddleware
