import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import EventList from '../components/Events/EventList/EventList'
import './Events.css'
import Spinner from '../components/Spinner/Spinner'
import AuthContext from '../context/auth-context'
import axios from 'axios'

class EventsPage extends Component {
    state = {
        modalOpen: false,
        title: '',
        price: '',
        date: '',
        description: '',
        events: [],
        isLoading: false,
        eventSelected: null
    }

    static contextType = AuthContext

    componentDidMount() {
        this.fetchEvents()
    }

    openModal = () => {
        this.setState({ modalOpen: true })
    }

    cancelAddEvent = () => {
        this.setState({ modalOpen: false, eventSelected: null })
    }

    confirmAddEvent = () => {
        this.setState({ modalOpen: false })

        const title = this.state.title
        const price = +this.state.price
        const date = this.state.date
        const description = this.state.description

        if (
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        )
            return

        const addEventMutation = `
                mutation {
                    createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
                        _id
                        title
                        price
                        date
                        description
                    }
                }
            `

        const token = this.context.token

        axios({
            url: 'http://localhost:3010/api/v1',
            method: 'post',
            data: {
                query: addEventMutation
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
                const { createEvent } = responseData.data.data
                this.setState(prevState => {
                    const updatedEvents = [
                        ...prevState.events,
                        {
                            _id: createEvent.userId,
                            title: createEvent.title,
                            price: createEvent.price,
                            date: createEvent.date,
                            description: createEvent.description,
                            creator: {
                                _id: this.context.userId
                            }
                        }
                    ]
                    return { events: updatedEvents }
                })
            })
            .catch(err => console.log(err))
    }

    fetchEvents() {
        this.setState({ isLoading: true })

        const eventsQuery = `
                query {
                    events {
                        _id
                        title
                        price
                        date
                        description
                        creator {
                            _id
                            email
                        }
                    }
                }
            `

        axios({
            url: 'http://localhost:3010/api/v1',
            method: 'post',
            data: {
                query: eventsQuery
            }
        })
            .then(response => {
                if (response.status !== 200 && response.status !== 201)
                    throw new Error('Failed')

                return response
            })
            .then(responseData => {
                const { events } = responseData.data.data

                this.setState({ events: [...events], isLoading: false })
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }

    showEventDetails = eventId => {
        this.setState(prevState => {
            const eventSelected = prevState.events.find(
                event => event._id === eventId
            )
            return { eventSelected: eventSelected }
        })
    }

    bookEvent = () => {
        if (!this.context.token) {
            this.setState({ eventSelected: null })
            return
        }

        const bookEventMutation = `
                mutation {
                    bookEvent(eventId: "${this.state.eventSelected._id}") {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `

        const token = this.context.token

        axios({
            url: 'http://localhost:3010/api/v1',
            method: 'post',
            data: {
                query: bookEventMutation
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
                console.log(responseData)
                this.setState({ eventSelected: null })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <>
                {(this.state.modalOpen || this.state.eventSelected) && (
                    <Backdrop />
                )}
                {this.state.modalOpen && (
                    <Modal
                        title='Add Event'
                        canCancel
                        canConfirm
                        cancel={this.cancelAddEvent}
                        confirm={this.confirmAddEvent}
                        confirmText='Confirm'
                    >
                        <form action=''>
                            <div className='form-control'>
                                <label htmlFor='title'>Title</label>
                                <input
                                    type='text'
                                    id='title'
                                    value={this.state.title}
                                    onChange={event =>
                                        this.setState({
                                            title: event.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className='form-control'>
                                <label htmlFor='price'>Price</label>
                                <input
                                    type='number'
                                    id='price'
                                    value={this.state.price}
                                    onChange={event =>
                                        this.setState({
                                            price: event.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className='form-control'>
                                <label htmlFor='date'>Date</label>
                                <input
                                    type='datetime-local'
                                    id='date'
                                    value={this.state.date}
                                    onChange={event =>
                                        this.setState({
                                            date: event.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className='form-control'>
                                <label htmlFor='description'>Description</label>
                                <textarea
                                    id='description'
                                    rows='4'
                                    value={this.state.description}
                                    onChange={event =>
                                        this.setState({
                                            description: event.target.value
                                        })
                                    }
                                ></textarea>
                            </div>
                        </form>
                    </Modal>
                )}
                {this.state.eventSelected && (
                    <Modal
                        title={this.state.eventSelected.title}
                        canCancel
                        canConfirm
                        cancel={this.cancelAddEvent}
                        confirm={this.bookEvent}
                        confirmText={this.context.token ? 'Book' : 'Confirm'}
                    >
                        <h1>{this.state.eventSelected.title}</h1>
                        <h2>
                            ${this.state.eventSelected.price} -
                            {new Date(
                                this.state.eventSelected.date
                            ).toLocaleDateString()}
                        </h2>
                        <p>{this.state.eventSelected.description}</p>
                    </Modal>
                )}
                {this.context.token && (
                    <div className='events-control'>
                        <p>Add an event!</p>
                        <button className='btn' onClick={this.openModal}>
                            Create Event
                        </button>
                    </div>
                )}
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                    <EventList
                        events={this.state.events}
                        userId={this.context.userId}
                        viewEventDetails={this.showEventDetails}
                    />
                )}
            </>
        )
    }
}

export default EventsPage
