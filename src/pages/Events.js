import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'
import AuthContext from '../context/auth-context'
import axios from 'axios'

class EventsPage extends Component {
    state = {
        modalOpen: false,
        title: '',
        price: '',
        date: '',
        description: '',
        events: []
    }

    static contextType = AuthContext

    componentDidMount() {
        this.fetchEvents()
    }

    openModal = () => {
        this.setState({ modalOpen: true })
    }

    cancelAddEvent = () => {
        this.setState({ modalOpen: false })
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
                this.fetchEvents()
            })
            .catch(err => console.log(err))
    }

    fetchEvents() {
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
                this.setState({ events: [...events] })
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <>
                {this.state.modalOpen && <Backdrop />}
                {this.state.modalOpen && (
                    <Modal
                        title='Add Event'
                        canCancel
                        canConfirm
                        cancel={this.cancelAddEvent}
                        confirm={this.confirmAddEvent}
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
                {this.context.token && (
                    <div className='events-control'>
                        <p>Add an event!</p>
                        <button className='btn' onClick={this.openModal}>
                            Create Event
                        </button>
                    </div>
                )}
                <ul className='events__list'>
                    {this.state.events.map(event => (
                        <li className='events__list-item' key={event._id}>
                            {event.title}
                        </li>
                    ))}
                </ul>
            </>
        )
    }
}

export default EventsPage
