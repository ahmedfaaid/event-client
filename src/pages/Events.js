import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'

class EventsPage extends Component {
    state = {
        modalOpen: false
    }

    openModal = () => {
        this.setState({ modalOpen: true })
    }

    cancelAddEvent = () => {
        this.setState({ modalOpen: false })
    }

    confirmAddEvent = () => {}

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
                        <p>Modal Content</p>
                    </Modal>
                )}
                <div className='events-control'>
                    <p>Add an event!</p>
                    <button className='btn' onClick={this.openModal}>
                        Create Event
                    </button>
                </div>
            </>
        )
    }
}

export default EventsPage
