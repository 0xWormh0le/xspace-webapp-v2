import React from 'react'
import { connect } from 'react-redux'
import  UploaderView  from '../components/UploaderView'
import * as reducers from '../reducers'

import { assetCreate, setMultifileUploadCounter, incrementMultifleUploadCounter } from '../actions/products'


const Uploader = (props) => {
  return (
    <UploaderView {...props} />
  )
}

const mapStateToProps = (state) => ({
  response: reducers.getAssetMultiUpload(state),
  progress: reducers.getAssetMultiUploadProgress(state),
  counter: reducers.getAssetMultiUploadCounter(state),
  total: reducers.getAssetMultiUploadTotal(state)
});

const mapDispatchToProps = (dispatch) => ({
  createAssets: (productArray) => {
    dispatch(assetCreate(productArray))
  },
  setCounter: (count) => {
    dispatch(setMultifileUploadCounter(count))
  },
  incrementCounter: () => {
    dispatch(incrementMultifleUploadCounter())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
