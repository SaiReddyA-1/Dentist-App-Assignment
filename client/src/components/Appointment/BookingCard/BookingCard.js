import React, { useState } from 'react';
import { useEffect } from 'react';
import AppointmentForm from '../AppointmentForm/AppointmentForm';

const BookingCard = ({doctor, date}) => {

  const [doctors, setDoctors] = useState([]);
  // const [serialNo, setSerialNo] = useState({});
  // const [noAppointment, setNoAppointment] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/doctors")
    .then(res => res.json())
    .then (data => setDoctors(data))
  },[])

  // setSerialNo(doctor.serialNo)

  console.log(doctors)

  const [modalIsOpen,setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal(){
    setIsOpen(false);
  }
    return (
      <>
        
                       
            <div className="col-md-4 my-5" >
            <div className="card p-3 h-100">
                <div className="card-body text-center" >
                    <h5 className="card-title text-brand">{doctor.name}</h5>
                    <h6>{doctor.qualifications}</h6> <br />
                    <small> {doctor.expertiseArea} expert</small> <br />
                    {/* <small>Email- {doctor.email}</small> <br /> */} 
                    {/* <small> Available in - {(doctor.chamberDays.join("  "))} at  </small> */}
                    {/* <h5>{doctor.maxSerialNo} SEATS ARE REMAINING.... </h5>  */}
                    <table className="table table-striped table-bordered table-hover table-sm">
                      <thead className="thead-dark">
                      <tr>
                        <th scope="col">Weekdays</th> 
                        <th scope="col">Available Appointment</th>
                      </tr>
                      </thead>
                      <tbody>

                      {
                      Object.keys(doctor.serialNo).map((key) => {
                        return <tr> <td>{key}</td> <td> {  (doctor.serialNo)[key] } </td></tr>
                     })
                    }
                      </tbody>
                    </table>
                    
                    

                     {/* { d.chamberDays.forEach(element => {
                        setDays(element)
                    })} */}
                    {/* <h6>{days[0]}</h6> */}
                    
                </div>
            </div>

          
           
            <button onClick={openModal} className="btn btn-brand text-uppercase w-100" >Book Appointment</button>
           
            {/* <button onClick={openModal} className="btn btn-brand text-uppercase w-100">Book Appointment</button> */}
                      <AppointmentForm modalIsOpen={modalIsOpen} appointmentOn={doctor.name} maxSerialNo={doctor.maxSerialNo} serialNo={doctor.serialNo} closeModal={closeModal} date={date}></AppointmentForm>

           

            
        </div>
        
        </>
        
    );
};

export default BookingCard;