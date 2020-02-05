import React, { Component } from 'react'
import AuthContext from '../context/auth-context'
import axios from 'axios'
import Spinner from '../components/Spinner/Spinner'

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: []
    }

    static contextType = AuthContext

    componentDidMount() {
        this.fetchBookings()
    }

    fetchBookings = () => {
        this.setState({ isLoading: true })

        const bookingsQuery = `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
            `

        const token = this.context.token

        axios({
            url: 'http://localhost:3010/api/v1',
            method: 'post',
            data: {
                query: bookingsQuery
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status !== 200 && response.status !== 201)
                    throw new Error('Failed')

                return response
            })
            .then(responseData => {
                const { bookings } = responseData.data.data
                this.setState({ bookings: [...bookings], isLoading: false })
                console.log(responseData)
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }

    render() {
        return (
            <>
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                    <ul>
                        {this.state.bookings.map(booking => (
                            <li key={booking._id}>
                                {booking.event.title} -{' '}
                                {new Date(
                                    booking.createdAt
                                ).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </>
        )
    }
}

export default BookingsPage
