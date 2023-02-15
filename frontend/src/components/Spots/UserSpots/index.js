import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUsersSpots } from "../../../store/spots";

import "./UserSpots.css"



const preview = (image) => {
    if (image === "No preview image available") {
        image = "https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?fit=2500%2C1666";
        return image;
    } else {
        return image;
    }
}

export default function UserSpots() {

    const dispatch = useDispatch();
    const history = useHistory();

    const allSpots = useSelector(state => state.spots.spots);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getUsersSpots())
    }, [dispatch])


    const spots = [];


    if (!allSpots) {
        return (
            <div className="title">
                You have no spots :\
            </div>
        )
    }

    Object.values(allSpots).forEach(spot => spots.push(spot))

    if (!spots.length) return null


    const onClick = (spotId) => {
        history.push(`/spots/${spotId}`)
    }

    return (
        <div className="allSpots-container">
            {spots && (
                spots.map((spot) => (
                    < div key={spot.id} className="spot"
                        onClick={() => onClick(spot.id)}>
                        <div className="spotImg">
                            <img
                                className="spot-preImg"
                                src={preview(spot.previewImage)}
                            />
                        </div>
                        <div className="spot-bottom-section">
                            <div className="spot-header">
                                <p className="spotLocal">{spot.city}, {spot.state}</p>
                            </div>
                            <div className="spot-middle-section">
                                <p className="spot-name">{spot.name}</p>
                            </div>
                            <div className="spot-footer">
                                <p className="price">${spot.price}</p>
                                <p className="price-perNight">night</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div >

    )
}
