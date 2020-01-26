import React, { Component } from 'react'
import './Auth.css'
import AuthContext from '../context/auth-context'

import axios from 'axios'

class AuthPage extends Component {
    state = {
        email: '',
        password: '',
        isLoginMode: true
    }

    static contextType = AuthContext

    switchAuthMode = () =>
        this.setState(prevState => {
            return {
                isLogin: !prevState.isLogin
            }
        })

    submitForm = e => {
        e.preventDefault()

        const enteredEmail = this.state.email
        const enteredPassword = this.state.password

        if (
            enteredEmail.trim().length === 0 ||
            enteredPassword.trim().length === 0
        )
            return

        let authQuery = `
            query {
                login(email: "${enteredEmail}", password: "${enteredPassword}") {
                    userId
                    token
                    tokenExpiration
                }
            }
        `

        if (!this.state.isLoginMode) {
            authQuery = `
                mutation {
                    createUser(userInput: {email: "${enteredEmail}", password: "${enteredPassword}"}) {
                        _id
                        email
                    }
                }
            `
        }

        axios({
            url: 'http://localhost:3010/api/v1',
            method: 'post',
            data: {
                query: authQuery
            }
        })
            .then(response => {
                if (response.status !== 200 && response.status !== 201)
                    throw new Error('Failed')

                return response
            })
            .then(responseData => {
                const authData = responseData.data.data
                if (authData.login.token) {
                    this.context.login(
                        authData.login.token,
                        authData.login.userId,
                        authData.login.tokenExpiration
                    )
                }
            })
            .catch(err => console.log(err))

        this.setState({
            email: '',
            password: ''
        })
    }

    render() {
        return (
            <>
                <h1 className='auth-text'>
                    {this.state.isLoginMode ? 'Login' : 'Sign up'}
                </h1>

                <form className='auth-form' onSubmit={this.submitForm}>
                    <div className='form-control'>
                        <label htmlFor='email'>E-Mail</label>
                        <input
                            type='email'
                            id='email'
                            value={this.state.email}
                            onChange={event =>
                                this.setState({ email: event.target.value })
                            }
                        />
                    </div>
                    <div className='form-control'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            value={this.state.password}
                            onChange={event =>
                                this.setState({ password: event.target.value })
                            }
                        />
                    </div>
                    <div className='form-action'>
                        <button type='submit'>
                            {this.state.isLoginMode ? 'Login' : 'Sign up'}
                        </button>
                        <button type='button' onClick={this.switchAuthMode}>
                            {this.state.isLoginMode ? 'Sign up' : 'Login'}{' '}
                            instead
                        </button>
                    </div>
                </form>
            </>
        )
    }
}

export default AuthPage
