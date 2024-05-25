import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import "mapbox-gl/dist/mapbox-gl.css";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = React.useState(
    myStorage.getItem("user")
  );
  const [showPopup] = React.useState(true);
  const [pins, setPins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [desc, setDesc] = React.useState(null);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [viewState, setViewState] = React.useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
  });

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios("/pins");
        setPins(res.data);
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, long, lat) => {
    console.log(`Marker clicked with id: ${id}`);
    setCurrentPlaceId(id);
    setViewState({
      ...viewState,
      longitude: long,
      latitude: lat,
    });
  };

  const handleAddClick = (e) => {
    const { lngLat } = e;
    console.log("Coordinates: ", lngLat);
    setNewPlace({
      lat: lngLat.lat,
      long: lngLat.lng,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUsername(null);
  };

  return (
    <div className="App">
      <Map
        mapboxAccessToken="pk.eyJ1IjoidmluaXRuYWdhcjIxIiwiYSI6ImNsd2J4a2FvcTBlcTcybnBudmVhcG5kMngifQ.tUkl4oG8fvWANZOGrhHY_A"
        initialViewState={{
          longitude: 78.9629,
          latitude: 20.5937,
          zoom: 4,
        }}
        viewState={viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <React.Fragment key={p._id}>
            <Marker longitude={p.long} latitude={p.lat}>
              <FaMapMarkerAlt
                style={{
                  fontSize: 20,
                  color:
                    p.username === currentUsername ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.long, p.lat)}
              />
            </Marker>
            {showPopup && p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
                closeOnClick={false}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {[...Array(p.rating)].map((_, i) => (
                      <FaStar
                        style={{ color: "orange", fontSize: "1.5vw" }}
                        key={i}
                      />
                    ))}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            onClose={() => setNewPlace(null)}
            closeOnClick={false}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say us something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log In
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUsername={setCurrentUsername}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
