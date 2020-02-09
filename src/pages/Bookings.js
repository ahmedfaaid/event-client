import React, { Component } from 'react'
import BookingList from '../components/Bookings/BookingList/BookingList'
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

    cancelBooking = bookingId => {
        this.setState({ isLoading: true })

        const cancelBookingMutation = `
                mutation {
                    cancelBooking(bookingId: "${bookingId}") {
                        _id
                        title
                    }
                }
            `

        const token = this.context.token

        axios({
            url: 'http://localhost:3010/api/v1',
            method: 'post',
            data: {
                query: cancelBookingMutation
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
                this.setState(prevState => {
                    const updatedBookings = prevState.bookings.filter(
                        booking => booking._id !== bookingId
                    )

                    return { bookings: updatedBookings, isLoading: false }
                })
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
                    <BookingList
                        bookings={this.state.bookings}
                        cancelBooking={this.cancelBooking}
                    />
                )}
            </>
        )
    }
}

export default BookingsPage
