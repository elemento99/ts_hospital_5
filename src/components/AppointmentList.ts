import { createElement, FC } from 'react';
import { Appointment } from '../types/hospital';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancel?: (id: string) => void;
}

const AppointmentList: FC<AppointmentListProps> = ({ appointments, onCancel }) => {
  return createElement('div', { className: 'list-group' },
    appointments.map(appointment =>
      createElement('div', {
        key: appointment.id,
        className: 'list-group-item'
      },
        createElement('div', { className: 'd-flex justify-content-between align-items-center' },
          createElement('div', null,
            createElement('h5', { className: 'mb-1' }, appointment.doctorName),
            createElement('p', { className: 'mb-1' }, `Patient: ${appointment.patientName}`),
            createElement('small', null, `${appointment.date} at ${appointment.time}`)
          ),
          appointment.status === 'pending' && onCancel && createElement('button', {
            className: 'btn btn-danger btn-sm',
            onClick: () => onCancel(appointment.id)
          }, 'Cancel')
        ),
        createElement('span', {
          className: `badge bg-${
            appointment.status === 'confirmed' ? 'success' :
            appointment.status === 'cancelled' ? 'danger' : 'warning'
          } ms-2`
        }, appointment.status)
      )
    )
  );
};

export default AppointmentList; 