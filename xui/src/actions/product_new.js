// case products.COMMENT_REQUEST:
//   return state
// case products.COMMENT_SUCCESS:
// return {
//   ...state,
//   products: action.product
// },
// case products.COMMENT_FAILURE:
// return {
//   ...state,
//   errors: action.payload
// },
// case products.COMMENT_THREAD_REQUEST:
// return state
// case products.COMMENT_THREAD_SUCCESS:
// return {
//   ...state,
//   products: action.product
// },
// case products.COMMENT_THREAD_FAILURE:
// return {
//   ...state,
//   errors: action.product
// }


// Determine the URL endpoints tmrw 

export const commentProductThread = (thread) => ({
    [RSAA]: {
      endpoint: API_ROOT + '/api/xspace-products/:/comments',
      method: 'GET',
      headers: withAuth({ 'Content-Type': 'application/json'}),
      types: [
        COMMENT_THREAD_REQUEST, COMMENT_THREAD_SUCCESS, COMMENT_THREAD_FAILURE
      ]
    }
  })
  
  
  export const productComment = (comment) => ({
    [RSAA]: {
      endpoint: API_ROOT + '/api/xspace-products/:/comments',
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json'}),
      body: comment,
      types: [
        COMMENT_REQUEST, COMMENT_SUCCESS, COMMENT_FAILURE
      ]
    }
  })
  