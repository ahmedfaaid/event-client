import React from 'react'
import './BookingsControls.css'

const BookingsControls = props => {
    return (
        <div className='bookings-control'>
            <button
                className={props.activeView === 'list' ? 'active' : ''}
                onClick={props.changeView.bind(this, 'list')}
            >
                List
            </button>
            <button
                className={props.activeView === 'chart' ? 'active' : ''}
                onClick={props.changeView.bind(this, 'chart')}
            >
                Chart
            </button>
        </div>
    )
}

export default BookingsControls
