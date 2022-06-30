import logo from './logo.svg';
import './App.css';
import { Routes, Route,Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Search from './Pages/Search';
import Navbar from './Component/Navbar';
import { Container } from 'react-bootstrap';
import axios from 'axios'
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null)
  const [subData, setSubData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState('')
  const baseApiKeys = "242fe036b992b20b56ad3de15dc65a10";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${baseApiKeys}`

  const searchLocation = async(event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data)
        console.log(data)
        
      })
     
      setLocation('')
    }
  }

  const coordinate = async()=>{
    if(data === null){
      console.log("hehe")
    }else{
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${data?.coord.lat}&lon=${data?.coord.lon}&exclude=minutely,alerts&appid=${baseApiKeys}&units=metric`)
        setSubData(response.data)
        setLoading(false)
      } catch (error) {
        
      }
    }
  }

  useEffect(()=>{
    coordinate()
  },[data])

  return (
    <div className="App">
      <Container>
      <Navbar Change={event => setLocation(event.target.value)} onKeyPress={searchLocation}/>
     <Routes>
     <Route path='/' element={<Navigate to='/home'/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/search' element={<Search data={data} subData={subData}/>}/>
     </Routes>
     </Container>
    </div>
  );
}

export default App;
