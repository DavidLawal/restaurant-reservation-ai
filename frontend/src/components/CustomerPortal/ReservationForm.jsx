import React from 'react';

const ReservationForm = ({ reservations, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const reservation = {
      id: Date.now(),
      date: formData.get('date'),
      time: formData.get('time'),
      guests: formData.get('guests'),
      specialRequests: formData.get('specialRequests'),
      status: 'confirmed'
    };
    onSubmit(reservation);
    e.target.reset();
  };

  return (
    <div className="reservation-section">
      <div className="reservation-form">
        <h3>Make a Reservation</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date:</label>
            <input type="date" name="date" required />
          </div>
          <div className="form-group">
            <label>Time:</label>
            <input type="time" name="time" required />
          </div>
          <div className="form-group">
            <label>Number of Guests:</label>
            <input type="number" name="guests" min="1" max="20" required />
          </div>
          <div className="form-group">
            <label>Special Requests:</label>
            <textarea name="specialRequests" />
          </div>
          <button type="submit" className="btn btn-primary">
            Book Table
          </button>
        </form>
      </div>

      <div className="reservation-list">
        <h3>Your Reservations</h3>
        {reservations.length === 0 ? (
          <p>No reservations yet</p>
        ) : (
          reservations.map(reservation => (
            <div key={reservation.id} className="reservation-item">
              <p><strong>Date:</strong> {reservation.date}</p>
              <p><strong>Time:</strong> {reservation.time}</p>
              <p><strong>Guests:</strong> {reservation.guests}</p>
              <p><strong>Status:</strong> {reservation.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReservationForm;