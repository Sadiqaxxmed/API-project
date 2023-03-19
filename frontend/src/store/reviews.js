import { csrfFetch } from "./csrf";

const SPOT_REVIEWS = 'reviews/SPOT_REVIEWS'
const ADD_REVIEW = 'spots/ADD_REVIEW'


//--------------------------------------------------------------------- ACTIONS

export const spotReviews = (spotId, reviews) => {
  return {
    type: SPOT_REVIEWS,
    spotId,
    reviews
  }
}

export const addReview = (spotId, review) => {
  return {
      type: ADD_REVIEW,
      spotId,
      review
  }
}


//---------------------------------------------------------------------- THUNKS

export const getSpotReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`)



  if (res.ok) {
      const reviews = await res.json()
      dispatch(spotReviews(spotId, reviews));
      return reviews
  }
}

export const addReviews = (spotId, review) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review)
  })

  if (res.ok) {
      const review = await res.json();
      dispatch(addReview(spotId, review));
      return review;
  }
}

//--------------------------------------------------------------------- REDUCER


const initialState = {
  spotReviews: {},
  userReviews: {}
}


const normalize = (reviews) => {
  const data = {};
  reviews.forEach(review => data[review.id] = review);
  return data;
}



export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
      case SPOT_REVIEWS: {
          const newState = { ...state }
          if (action.reviews.reviews) {
              newState.spotReviews = normalize(action.reviews.reviews)
              return newState
          }
      }
      case ADD_REVIEW: {
        const newState = { ...state }
        newState.spotReviews = { ...state.spotReviews, [action.review.id]: action.review }
        newState.userReviews = { ...state.userReviews, [action.review.id]: action.review }
        return newState
      }
      default:
          return state
  }

}
