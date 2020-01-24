import React from 'react'
import './App.css'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import Navigation from './components/Navigation/Navigation'

function App() {
    return (
        <BrowserRouter>
            <>
                <Navigation />
                <main className='main-content'>
                    <Switch>
                        <Redirect from='/' to='/auth' exact />
                        <Route path='/auth' component={AuthPage} />
                        <Route path='/events' component={EventsPage} />
                        <Route path='/bookings' component={BookingsPage} />
                    </Switch>
                </main>
            </>
        </BrowserRouter>
    )
}

export default App
