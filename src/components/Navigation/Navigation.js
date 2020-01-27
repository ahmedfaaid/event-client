import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navigation.css'
import AuthContext from '../../context/auth-context'

const Navigation = props => (
    <AuthContext.Consumer>
        {context => {
            return (
                <header className='navigation'>
                    <div className='navigation__logo'>
                        <h1>Eventy</h1>
                    </div>
                    <nav className='navigation__items'>
                        <ul>
                            <li>
                                <NavLink to='/events'>Events</NavLink>
                            </li>
                            {context.token && (
                                <li>
                                    <NavLink to='/bookings'>Bookings</NavLink>
                                </li>
                            )}
                            {!context.token && (
                                <li>
                                    <NavLink to='/auth'>Login</NavLink>
                                </li>
                            )}
                            {context.token && (
                                <li>
                                    <button onClick={context.logout}>
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </header>
            )
        }}
    </AuthContext.Consumer>
)

export default Navigation
