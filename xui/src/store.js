import storage from 'redux-persist/es/storage'
import { applyMiddleware, createStore } from 'redux'
import { createFilter   } from 'redux-persist-transform-filter';
import { persistReducer, persistStore } from 'redux-persist'
import { routerMiddleware } from 'react-router-redux'

import apiMiddleware from './middleware';
import progressMiddleware from './progressMiddleware'
import rootReducer from './reducers'

export default (history) => {

  const reducer = persistReducer(
    {
      key: 'root',
      storage: storage
    },
    rootReducer
  )

  const store = createStore(
    reducer, {},
    applyMiddleware(progressMiddleware, apiMiddleware, routerMiddleware(history))
  )

  persistStore(store)

  return store
}

export function configureStore(history) {

}
