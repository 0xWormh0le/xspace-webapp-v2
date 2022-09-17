import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { routerMiddleware } from 'react-router-redux'
import apiMiddleware from './middleware';
import progressMiddleware from './progressMiddleware'

import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const reducer = persistReducer(
  {
    key: 'root',
    storage: storage
  },
  rootReducer
)


export default (history) => {
  let store = createStore(persistedReducer, {},
    applyMiddleware(progressMiddleware, apiMiddleware, routerMiddleware(history)))
  let persistor = persistStore(store)
  return { store, persistor }
}
