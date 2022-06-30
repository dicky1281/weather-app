import React, { useState, useEffect } from "react";
import { Modal, Popover, OverlayTrigger } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import "./Page.css";
const Home = () => {
  const [lgShow, setLgShow] = useState(false);
  // My Keys
  const baseApiKeys = "10d710ffeb276ae3283cf00d7e63b169";

  // To Get Coordinate Location
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  // To Get requirement data
  const [current, setCurrent] = useState(null);
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
      setCurrent(res.data);
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
    } catch (error) {}
  };

  useEffect(() => {
    getLocation();
    getHour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, current?.name]);

  return (
    <>
      <div className="home">
        <h2 style={{ color: "white", marginBottom: "20px" }}>Your Location</h2>
        <div className="current-status">
          <h2>{current?.name}</h2>
          <h4>
            {moment().format("dddd")}, {moment().format("MMM Do")}
          </h4>
          <h4>{moment().format("LT")}</h4>

          <img
            src={`https://openweathermap.org/img/wn/${current?.weather[0].icon}@2x.png`}
            alt=""
          />
          <h4>{current?.weather[0].main}</h4>
          <div className="temperature pt-3">
            <h4>
              <i className="fas fa-thermometer-quarter"></i>{" "}
              {current?.main?.temp_min}ºC / {current?.main?.temp_max}ºC
              <br /> <i className="fas fa-wind"></i> {current?.wind?.speed} MPH
            </h4>
          </div>
        </div>
        <div className="daily">
          <div className="daily-header">
            <h3>Todays Forecast For 24 Hours Forwards</h3>
            <h3 className="btn btn-warning" onClick={() => setLgShow(true)}>
              See More!
            </h3>
          </div>
          <div className="wrapper">
            <div className="row">
              {hourly?.slice(0, 5).map((item, index) => {
                return (
                  <>
                    <div className="card col-md-6 col-xs-12">
                      <div className="5">
                        Time {moment.unix(item.dt).format("LT")}
                      </div>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt=""
                      />
                      <h3>{item.weather[0].description}</h3>
                      <h4>
                        <i className="fas fa-thermometer-quarter"></i>{" "}
                        {item.temp}ºC <br /> <i className="fas fa-wind"></i>{" "}
                        {item.wind_speed} MPH
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
                24 Hours Forecast
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {" "}
              <div className="row">
                {hourly?.slice(0, 25).map((item, index) => {
                  return (
                    <>
                      <div className="card col-md-6 col-xs-12">
                        <div className="5">
                          Time {moment.unix(item.dt).format("LT")}
                        </div>
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                          alt=""
                        />
                        <h3>{item.weather[0].description}</h3>
                        <h4>
                          <i className="fas fa-thermometer-quarter"></i>{" "}
                          {item.temp}ºC <br /> <i className="fas fa-wind"></i>{" "}
                          {item.wind_speed} MPH
                        </h4>
                      </div>
                    </>
                  );
                })}
              </div>
            </Modal.Body>
          </Modal>
        </div>
        <div className="day">
          <div className="daily-header">
            <h3>Forecast For 8 Days Forward</h3>
          </div>
          <div className="wrapper">
            <div className="row">
              {day?.slice(0, 8).map((item, index) => {
                return (
                  <>
                    <div className="card col-md-6 col-xs-12">
                      <div className="5">
                        {moment.unix(item.dt).format("dddd")}
                      </div>

                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt=""
                      />
                      <p>Overall</p>
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
                                <h6>Feels Like Temp:</h6>
                                <h6>
                                  <i
                                    className="fas fa-cloud"
                                    style={{ color: "whiteSmokek" }}
                                  ></i>
                                  Morn : {item.feels_like.morn}ºC
                                </h6>
                                <h6>
                                  <i
                                    className="fas fa-sun"
                                    style={{ color: "yellow" }}
                                  ></i>{" "}
                                  Day : {item.feels_like.day}ºC
                                </h6>
                                <h6>
                                  <i className="fas fa-moon"> </i> Night :{" "}
                                  {item.feels_like.eve}ºC
                                </h6>
                                <h6>
                                  <i className="fas fa-wind"></i> Wind :{" "}
                                  {item.wind_speed} MPH
                                </h6>
                              </div>
                              <hr />
                              <div className="moments">
                                <h6>
                                  Sunrise :{" "}
                                  {moment.unix(item.sunrise).format("LT")}
                                </h6>
                                <h6>
                                  Sunset :{" "}
                                  {moment.unix(item.sunset).format("LT")}
                                </h6>
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
