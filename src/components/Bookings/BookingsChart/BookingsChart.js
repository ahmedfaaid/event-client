import React from 'react'
import { Bar } from 'react-chartjs-2'

const BOOKINGS_BUCKETS = {
    Cheap: {
        min: 0,
        max: 100
    },
    Normal: {
        min: 101,
        max: 200
    },
    Expensive: {
        min: 201,
        max: 1000
    }
}

const BookingsChart = props => {
    const chartData = { labels: [], datasets: [] }
    let values = []

    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if (
                current.event.price > BOOKINGS_BUCKETS[bucket].min &&
                current.event.price < BOOKINGS_BUCKETS[bucket].max
            ) {
                return prev + 1
            } else {
                return prev
            }
        }, 0)
        values.push(filteredBookingsCount)
        chartData.labels.push(bucket)
        chartData.datasets.push({
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: values
        })
        values = [...values]
        values[values.length - 1] = 0
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <Bar
                data={chartData}
                width={50}
                height={25}
                legend={{ display: false }}
            />
        </div>
    )
}

export default BookingsChart
