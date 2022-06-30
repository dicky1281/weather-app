import './App.css';
import { Routes, Route,Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Search from './Pages/Search';
import Navbar from './Component/Navbar';
import { Container } from 'react-bootstrap';
import axios from 'axios'
import { useEffect, useState } from 'react';
import Footer from './Component/Footer';

function App() {
  const [data, setData] = useState(null)
  const [subData, setSubData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState('')
  const baseApiKeys = "10d710ffeb276ae3283cf00d7e63b169";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${baseApiKeys}`

  const searchLocation = async(event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data)
        
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
     <Footer/>
    </div>
  );
}

export default App;
