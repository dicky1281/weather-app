import React, { useState, useEffect } from "react";
import { Modal, Popover, OverlayTrigger } from "react-bootstrap";
import axios from "axios";
import "./Home.css";
const Home = () => {

  const [lgShow, setLgShow] = useState(false);
  // My Keys
  const baseApiKeys = "242fe036b992b20b56ad3de15dc65a10";

  // To Get Coordinate Location
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  // To Get requirement data
  const [icon, setIcon] = useState("");
  const [weather, setWeather] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [cityName, setCityName] = useState("");
  const [hourly, setHourly] = useState(null);
  const [day, setDay] = useState(null);

  const savePositionToState = (position) => {
    setLat(position.coords.latitude);
    setLon(position.coords.longitude);
  };

  const getLocation = async () => {
    try {
      await window.navigator.geolocation.getCurrentPosition(
        savePositionToState
      );
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${baseApiKeys}&units=metric`
      );
      setTemperature(res.data.main);
      setCityName(res.data.name);
      setWeather(res.data.weather[0].main);
      setIcon(res.data.weather[0].icon);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getHour = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${baseApiKeys}&units=metric`
      );
      setHourly(res.data.hourly);
      setDay(res.data.daily);
      console.log(day);
    } catch (error) {}
  };

  useEffect(() => {
    getLocation();
    getHour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, cityName]);

  let d = new Date();
  let date = d.getDate();
  let year = d.getFullYear();
  let month = d.toLocaleString("default", { month: "long" });
  let days = d.toLocaleString("default", { weekday: "long" });

  return (
    <>
      <div className="home">

        <h2 style={{ color: "white", marginBottom: "20px" }}>Your Location</h2>
        <div className="current-status">
          <h2>{cityName}</h2>
          <h4>
            {days}, {month} {date}, {year}
          </h4>

          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt=""
          />
          <h4>{weather}</h4>
          <div className="temperature pt-3">
            <h4>
              <i className="fas fa-thermometer-quarter"></i>{" "}
              {temperature.temp_min}ºC / {temperature.temp_max}ºC
            </h4>
          </div>
        </div>
        <div className="daily">
          <div className="daily-header">
            <h3>Todays Forecast For 25 Hours Forwards</h3>
            <h3 className="btn btn-warning" onClick={() => setLgShow(true)}>
              See More!
            </h3>
          </div>
          <div className="wrapper">
            <div className="row">
             
              {hourly?.slice(0, 5).map((item, index) => {
                const hour = new Date(item.dt * 1000).getHours();
                return (
                  <>
                    <div className="card col-md-6 col-xs-12">
                      <div className="5">Time {hour}:00</div>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt=""
                      />
                      <h3>{item.weather[0].description}</h3>
                      <h4>
                        <i className="fas fa-thermometer-quarter"></i>{" "}
                        {item.temp}ºC
                      </h4>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <Modal
            size="xl"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                25 Hours Forecast
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {" "}
              <div className="row">
                {hourly?.slice(0, 25).map((item, index) => {
                  const hour = new Date(item.dt * 1000).getHours();
                  return (
                    <>
                      <div className="card col-md-6 col-xs-12">
                        <div className="5">Time {hour}:00</div>
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                          alt=""
                        />
                        <h3>{item.weather[0].description}</h3>
                        <h4>{item.temp}ºC</h4>
                      </div>
                    </>
                  );
                })}
              </div>
            </Modal.Body>
          </Modal>
        </div>
        <div className="day">
          <div className="day-header">
            <h3>Forecast For 8 Days Forward</h3>
          </div>
          <div className="wrapper">
            <div className="row">
     
              {day?.slice(0, 7).map((item, index) => {
                let date = new Date(item.dt * 1000)
                let day = date.toLocaleString("default",{weekday:"long"})
                console.log(day)


                return (
                  <>
                  
                    <div className="card col-md-6 col-xs-12">
                      <div className="5">{day}</div>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt=""
                      />
                      <h3>{item.weather[0].description}</h3>
                      <h3>
                        <i className="fas fa-thermometer-quarter"></i>{" "}
                        {item.temp.min}ºC / {item.temp.max}ºC
                      </h3>

                      <OverlayTrigger
                        trigger="click"
                        key="top"
                        placement="top"
                        overlay={
                          <Popover id={`popover-positioned-top`}>
                            <Popover.Body>
                              <div className="feels-like">
                                <h5>Feels Like:</h5>
                                <h6><i className="fas fa-cloud" style={{ color:"whiteSmokek" }}></i>Morn : {item.feels_like.morn}ºC</h6>
                                <h6><i className="fas fa-sun" style={{ color:"yellow" }}></i> Day : {item.feels_like.day}ºC</h6>
                                <h6><i className="fas fa-moon"> </i> Night : {item.feels_like.eve}ºC</h6>
                              </div>
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <button className="btn btn-dark">View Detail</button>
                      </OverlayTrigger>
                    </div>
                  </>
                );
              })}
            
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;