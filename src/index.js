const extractBody = async response => {
  const ctype = response.headers.get('content-type')

  if (ctype && ctype.includes('application/json'))
    return response.json()

  return response.text()
}

const requestMiddleware = ({ getState }) => dispatch =>
  async ({ type, url, method = 'GET', body, onSuccess, onError, ...action }) => {
    const state = getState()
    const headers = {
      'Content-Type': 'application/json',
      ...action.headers || {},
    }

    if (!type || !url || !type.includes('@@REQUEST/'))
      return dispatch(action)

    dispatch({ type: `${type}_PENDING` })

    try {
      const response = await fetch(url, { method, headers, body })
      const data = await extractBody(response)

      if (response.status !== 200)
        throw new Error(JSON.stringify(data))

      dispatch({
        type: `${type}_SUCCESS`,
        payload: { data, error: null },
        ...action,
      })

      if (onSuccess)
        return onSuccess(body, state)
    } catch ({ message }) {
      const error = JSON.parse(message)

      dispatch({
        type: `${type}_ERROR`,
        payload: { data: null, error },
      })

      if (onError)
        return onError(error, state)
    }
  }

export default requestMiddleware
