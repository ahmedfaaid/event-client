import React from 'react'
import './EventList.css'
import EventItem from './EventItem/EventItem'

const EventList = ({ events, userId, viewEventDetails }) => (
    <ul className='event__list'>
        {events.map(event => (
            <EventItem
                key={event._id}
                eventId={event._id}
                title={event.title}
                price={event.price}
                date={event.date}
                userId={userId}
                creatorId={event.creator._id}
                eventDetail={viewEventDetails}
            />
        ))}
    </ul>
)

export default EventList
