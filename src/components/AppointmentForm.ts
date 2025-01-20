import { createElement, FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import { ErrorAlert, LoadingSpinner } from './';

const AppointmentForm: FC = () => {
  const navigate = useNavigate();
  const { addAppointment, getDoctors, doctors, loading, error } = useHospital();
  const [formData, setFormData] = useState({
    doctorName: '',
    patientName: '',
    date: '',
    time: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.doctorName) {
      setFormError('Please select a doctor');
      return false;
    }
    if (!formData.patientName.trim()) {
      setFormError('Patient name is required');
      return false;
    }
    if (!formData.date) {
      setFormError('Please select a date');
      return false;
    }
    if (!formData.time) {
      setFormError('Please select a time');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormError('');
    setSubmitting(true);

    try {
      await addAppointment({
        ...formData,
        status: 'pending'
      });
      navigate('/appointments');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return createElement(LoadingSpinner);
  }

  const selectedDoctor = doctors.find(d => d.name === formData.doctorName);

  return createElement('div', { className: 'container mt-5' },
    createElement('div', { className: 'row justify-content-center' },
      createElement('div', { className: 'col-md-6' },
        (error || formError) && createElement(ErrorAlert, { message: error || formError }),
        createElement('form', { onSubmit: handleSubmit },
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'doctorName',
              className: 'form-label'
            }, 'Select Doctor'),
            createElement('select', {
              className: 'form-select',
              id: 'doctorName',
              name: 'doctorName',
              value: formData.doctorName,
              onChange: handleChange,
              required: true
            },
              createElement('option', { value: '' }, 'Choose a doctor'),
              doctors.map(doctor => 
                createElement('option', {
                  key: doctor.id,
                  value: doctor.name
                }, doctor.name)
              )
            )
          ),
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'patientName',
              className: 'form-label'
            }, 'Patient Name'),
            createElement('input', {
              type: 'text',
              className: 'form-control',
              id: 'patientName',
              name: 'patientName',
              value: formData.patientName,
              onChange: handleChange,
              required: true
            })
          ),
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'date',
              className: 'form-label'
            }, 'Date'),
            createElement('input', {
              type: 'date',
              className: 'form-control',
              id: 'date',
              name: 'date',
              value: formData.date,
              onChange: handleChange,
              min: new Date().toISOString().split('T')[0],
              required: true
            })
          ),
          selectedDoctor && createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'time',
              className: 'form-label'
            }, 'Time'),
            createElement('select', {
              className: 'form-select',
              id: 'time',
              name: 'time',
              value: formData.time,
              onChange: handleChange,
              required: true
            },
              createElement('option', { value: '' }, 'Choose a time'),
              selectedDoctor.availability.map(time =>
                createElement('option', {
                  key: time,
                  value: time
                }, time)
              )
            )
          ),
          createElement('button', {
            type: 'submit',
            className: 'btn btn-primary w-100',
            disabled: submitting
          }, submitting ? 'Creating Appointment...' : 'Create Appointment')
        )
      )
    )
  );
};

export default AppointmentForm; 