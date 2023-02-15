import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addSpots, addPreviewImg} from "../../../store/spots";
import { useModal } from "../../../context/Modal";
import "./CreateSpot.css"

export default function CreateSpotForm() {

    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imgUrl, setImgURL] = useState("")
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const errors = [];

        if (address && !address.length) {
            errors.push("Address is required.");
        }

        if (city && !city.length) {
            errors.push("City is required.");
        }

        if (state && !state.length) {
            errors.push("State is required.");
        }

        if (country && !country.length) {
            errors.push("Country is required.");
        }

        if (name && !name.length) {
            errors.push("Name is required.")
        }

        if (description && !description.length) {
            errors.push("Description is required.")
        }

        if (description.length > 50) {
            errors.push("Description length must be less than 50 characters.")
        }

        if (price && (price < 1 || price > 10000)) {
            errors.push("Price per night must be greater than 0, and less than 10,000.")
        }

        setErrors(errors);
    }, [address, city, state, country, name, description, price]);


    const onSubmit = async (e) => {
        e.preventDefault();

        const lat = 13;
        const lng = 4;

        const newSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        };

        setErrors([]);

        const url = imgUrl;

        const createdSpot = await dispatch(addSpots(newSpot))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })


        const previewImg = await dispatch(addPreviewImg(createdSpot.id, url, true))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })


        closeModal();
        history.push(`/spots/${createdSpot.id}`);

    }

    return (
        <div className="createSpot-form">
            <h1 className="title">Create a Spot!</h1>
            <ul className="errors-messages">
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <form
                onSubmit={onSubmit}
                className="form"
            >
                <div className="input-fields">
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <label htmlFor="address">
                        Address
                    </label>
                </div>

                <div className="input-fields">
                    <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                    <label htmlFor="city">
                        City
                    </label>
                </div>

                <div className="input-fields">
                    <input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                    <label htmlFor="state">
                        State
                    </label>
                </div>

                <div className="input-fields">
                    <input
                        id="country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                    <label htmlFor="country">
                        Country
                    </label>
                </div>

                <div className="input-fields">
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label htmlFor="name">
                        Spot Name
                    </label>
                </div>

                <div className="input-fields">
                    <input
                        className="description"
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <label htmlFor="description">
                        Description
                    </label>
                </div>

                <div className="input-fields">
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <label htmlFor="price">
                        Price
                    </label>
                </div>

                <div className="input-fields">
                    <input
                        id="imgUrl"
                        type="url"
                        value={imgUrl}
                        onChange={(e) => setImgURL(e.target.value)}
                        required
                    />
                    <label htmlFor="price">
                        Preview Image
                    </label>
                </div>

                <button type="submit" className="create-button">Create New Spot</button>

            </form>
        </div>
    )
}
