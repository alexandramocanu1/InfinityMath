import { useState } from 'react';

export const useBooking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [bookingStep, setBookingStep] = useState(1);
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  const handleBookingSubmit = () => {
    if (bookingStep === 1) {
      setBookingStep(2);
    } else if (bookingStep === 2) {
      setBookingStep(3);
    } else if (bookingStep === 3) {
      // Simulez procesarea plății
      setTimeout(() => {
        setIsBookingComplete(true);
        // Aici ar trebui să trimiți email-urile
        console.log('Programare completă:', {
          service: selectedService,
          date: selectedDate,
          time: selectedTime,
          client: bookingData,
          payment: paymentData
        });
      }, 2000);
    }
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');
    setBookingData({ name: '', email: '', phone: '', message: '' });
    setPaymentData({ cardNumber: '', expiryDate: '', cvv: '', cardName: '' });
    setIsBookingComplete(false);
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedService,
    setSelectedService,
    bookingData,
    setBookingData,
    paymentData,
    setPaymentData,
    bookingStep,
    setBookingStep,
    isBookingComplete,
    handleBookingSubmit,
    resetBooking
  };
};