import { isRSAA, RSAA } from 'redux-api-middleware'

const normalizeTypeDescriptor = type => {
  if (typeof type === 'string' || typeof type === 'symbol') {
    type = { type }
  }

  return type
}

const progressMiddleware = store => next => action => {
  if (!isRSAA(action)) {
    return next(action)
  }

  const { fetch, types } = action[RSAA]

  if (typeof fetch !== 'function' && types.length === 4) {
    console.log("ENTER")
    const uploadProgressType = types.pop()

    action[RSAA].fetch = (url, options) => new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          store.dispatch({
            ...normalizeTypeDescriptor(uploadProgressType),
            payload: event.loaded / event.total
          })
          console.log((event.loaded / event.total) * 100)
        }
      }

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'))
      }

      xhr.onload = function () {
        resolve(new Response(
          new Blob(
            [this.responseText],
            { type: this.getResponseHeader('Content-Type') }
          ),
          {
            status: this.status,
            statusText: this.statusText,
            headers: Object.assign({}, ...this.getAllResponseHeaders().trim().split('\r\n').map(header => {
              const parts = header.split(': ')
              return { [parts[0]]: parts[1] }
            }))
          }
        ))
      }

      xhr.open(options.method, url, true)
      xhr.setRequestHeader("Authorization", options.headers["Authorization"])
      xhr.send(options.body)
    })

    action[RSAA].types = types
  }

  return next(action)
}

export default progressMiddleware
