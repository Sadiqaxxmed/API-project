import { csrfFetch } from "./csrf";

const SPOT_REVIEWS = 'reviews/SPOT_REVIEWS'

//--------------------------------------------------------------------- ACTIONS

export const spotReviews = (spotId, reviews) => {
  return {
    type: SPOT_REVIEWS,
    spotId,
    reviews
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
      default:
          return state
  }

}
