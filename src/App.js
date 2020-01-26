import React, { Component } from 'react'
import './App.css'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import AuthContext from './context/auth-context'

import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import Navigation from './components/Navigation/Navigation'

class App extends Component {
    state = {
        token: '',
        userId: ''
    }

    login = (token, userId, tokenExpiration) => {
        this.setState({ token, userId })
    }

    logout = () => {
        this.setState({ token: '', userId: '' })
    }

    render() {
        return (
            <BrowserRouter>
                <>
                    <AuthContext.Provider
                        value={{
                            token: this.state.token,
                            userId: this.state.userId,
                            login: this.login,
                            logout: this.logout
                        }}
                    >
                        <Navigation />
                        <main className='main-content'>
                            <Switch>
                                {!this.state.token && (
                                    <Redirect from='/' to='/auth' exact />
                                )}
                                {this.state.token && (
                                    <Redirect from='/' to='/events' exact />
                                )}
                                {this.state.token && (
                                    <Redirect from='/auth' to='/events' exact />
                                )}
                                {!this.state.token && (
                                    <Route path='/auth' component={AuthPage} />
                                )}
                                <Route path='/events' component={EventsPage} />
                                {this.state.token && (
                                    <Route
                                        path='/bookings'
                                        component={BookingsPage}
                                    />
                                )}
                            </Switch>
                        </main>
                    </AuthContext.Provider>
                </>
            </BrowserRouter>
        )
    }
}

export default App
