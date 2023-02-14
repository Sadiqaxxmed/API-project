import { csrfFetch } from "./csrf";

const SINGLE_SPOT = 'spots/SINGLE_SPOT'
const USERS_SPOTS = 'spots/USERS_SPOTS';
const ALL_SPOTS = 'spots/ALL_SPOTS';

//--------------------------------------------------------------------- ACTIONS

export const singleSpot = (spot) => {
  return {
      type: SINGLE_SPOT,
      spot
  }
}

export const userSpots = (spots) => {
  return {
      type: USERS_SPOTS,
      spots
  }
}

export const allSpots = (spots) => {
  return {
      type: ALL_SPOTS,
      spots
  }
}

//--------------------------------------------------------------------- THUNKS

export const getSingleSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`)

  if (res.ok) {
      const spot = await res.json();
      dispatch(singleSpot(spot))
      return spot;
  }
}

export const getUsersSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current")

  if (res.ok) {
      const spots = await res.json();
      dispatch(allSpots(spots));
      return spots;
  }
}

export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots")
  if (res.ok) {
      const spots = await res.json();
      dispatch(allSpots(spots));
      return spots;
  }
}


const initialState = {
  spots: {},
  singleSpot: {}
}


const normalize = (spots) => {
  const data = {};
  if (spots.Spots) {
      spots.Spots.forEach(spot => data[spot.id] = spot);
      return data;
  }
}

//--------------------------------------------------------------------- REDUCER

export default function spotReducer(state = initialState, action) {

  switch (action.type) {
      case ALL_SPOTS: {
        const newState = { ...state }
          newState.spots = normalize(action.spots)
          return newState
      }
      case USERS_SPOTS: {
        const newState = { ...state }
          newState.spots = normalize(action.spots)
          return newState
      }
      case SINGLE_SPOT: {
        const newState = { ...state }
          newState.singleSpot = action.spot
          return newState
      }
      default:
        return state;
  }
}
