import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";


const Navbar = (props) => {
    const navigate = useNavigate()


  return (
    <nav className='pt-4'>
        <NavLink to='/home'><button className='btn btn-light'><i className="fas fa-home"></i></button></NavLink>
        
        <div className="inputs">
        <input type="text" onChange={props.Change} onKeyPress={props.onKeyPress} onClick={()=>{navigate('/search')}}/>

        </div>
        
    </nav>
  )
}

export default Navbar