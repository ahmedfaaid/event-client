import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navigation.css'

const Navigation = props => (
    <header className='navigation'>
        <div className='navigation__logo'>
            <h1>Eventy</h1>
        </div>
        <nav className='navigation__items'>
            <ul>
                <li>
                    <NavLink to='/events'>Events</NavLink>
                </li>
                <li>
                    <NavLink to='/bookings'>Bookings</NavLink>
                </li>
                <li>
                    <NavLink to='/auth'>Login</NavLink>
                </li>
            </ul>
        </nav>
    </header>
)

export default Navigation
