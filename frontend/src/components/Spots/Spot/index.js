import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleSpot } from "../../../store/spots";

import "./Spot.css"

export default function Spot() {
    const { spotId } = useParams()
    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots.singleSpot)
    const user = useSelector(state => state.session.user)

    let owner;
    if (user && spot) {
        spot.ownerId === +user.id ? owner = true : owner = false
    }

    useEffect(() => {
        dispatch(getSingleSpot(spotId))
    }, [dispatch, spotId])


    if (spot === {}) return null
    if (Object.values(spot).length === 0) return null

    if (spot === undefined) return null;
    if (user === undefined) return null;


    const images = [
        "https://a0.muscache.com/im/pictures/01773f80-f5f8-487c-9a12-b28d91eb1336.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/fc768d95-8382-46e9-a1ea-d5440ca63618.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/b69c4864-2ebc-4e5e-9866-1ec84ceef831.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/a31edca0-34ca-4278-b8ee-e8e2c457cb80.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/a9a5e884-0ce4-442d-9348-a5bd130e8811.jpg?im_w=720",
    ];


    if (spot) {
        if (spot.SpotImages !== "No images listed") {
            for (let i = 0; i < spot.SpotImages.length; i++) {
                images[i] = spot.SpotImages[i].url;
            }
        }
    }


    return spot && (
 

        <div className="spot-div">

            <h1 className="spot-name">{spot.name}</h1>

            <div className="header">
                <div className="header-left">
                    <p className="header-left" id="location">{spot.city}, {spot.state}, {spot.country}</p>
                </div>
            </div>

            <div className="img-section">
                <img className="main-picture" src={images[0]} />
                <div className="side-pictures">
                    <img className="side-picture" id="pic-1" src={images[1]} />
                    <img className="side-picture" id="pic-2" src={images[2]} />
                    <img className="side-picture" id="pic-3" src={images[3]} />
                    <img className="side-picture" id="pic-4" src={images[4]} />
                </div>
            </div>




          <div className="spot-detail-section">

            <div className="spot-detail">
                <h2 className="owner-detail"> Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                <p className="spot-description">{spot.description}</p>
            </div>


            <div className="reserve-card">
                <div className="reserve-top">
                <p className="Spot-price">${spot.price} night</p>


                </div>
                <div className="reserve-bottom">
                <button type="submit" className='login-button' id='log-button'>Reserve</button>
                </div>
            </div>

          </div>

        </div>

    )
}
