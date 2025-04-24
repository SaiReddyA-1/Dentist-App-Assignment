import React, { useState } from 'react';
import { useEffect } from 'react';
import BookingCard from '../BookingCard/BookingCard';

const BookAppointment = ({date}) => {
    const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/doctors")
    .then(res => res.json())
    .then (data => setDoctors(data))
  },[])
    return (
        <section>
          
            <h2 className="text-center text-brand mb-5"> Available Appointments on {date.toDateString()}</h2>
            <div className="row">      
            {
                doctors.map((d)=> <BookingCard doctor={d} date={date}></BookingCard> )
            }          
                                    
            </div>
        </section>
    );
};

export default BookAppointment;