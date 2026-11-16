import React from 'react';

const ReservationManagement = ({ reservations, onUpdateReservationStatus }) => {
  return (
    <div className="admin-section">
      <h3>Reservation Management</h3>
      <div className="reservations-list">
        {reservations.length === 0 ? (
          <p>No reservations yet</p>
        ) : (
          reservations.map(reservation => (
            <div key={reservation.id} className="reservation-item">
              <div className="reservation-info">
                <h4>Reservation #{reservation.id}</h4>
                <p><strong>Date:</strong> {reservation.date}</p>
                <p><strong>Time:</strong> {reservation.time}</p>
                <p><strong>Guests:</strong> {reservation.guests}</p>
                <p><strong>Requests:</strong> {reservation.specialRequests || 'None'}</p>
              </div>
              <div className="reservation-actions">
                <select
                  value={reservation.status}
                  onChange={(e) => onUpdateReservationStatus(reservation.id, e.target.value)}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;