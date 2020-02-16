import React, { Component } from 'react'
import BookingList from '../components/Bookings/BookingList/BookingList'
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart'
import AuthContext from '../context/auth-context'
import axios from 'axios'
import Spinner from '../components/Spinner/Spinner'
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls'

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: [],
        view: 'list'
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
                            price
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
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
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
                query: cancelBookingMutation,
                variables: {
                    id: bookingId
                }
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

    changeView = view => {
        if (view === 'list') {
            this.setState({ view: 'list' })
        } else {
            this.setState({ view: 'chart' })
        }
    }

    render() {
        let content = <Spinner />
        if (!this.state.isLoading) {
            content = (
                <>
                    <BookingsControls
                        activeView={this.state.view}
                        changeView={this.changeView}
                    />
                    <div>
                        {this.state.view === 'list' ? (
                            <BookingList
                                bookings={this.state.bookings}
                                cancelBooking={this.cancelBooking}
                            />
                        ) : (
                            <BookingsChart bookings={this.state.bookings} />
                        )}
                    </div>
                </>
            )
        }
        return <>{content}</>
    }
}

export default BookingsPage
