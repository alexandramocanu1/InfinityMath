export const services = [
  {
    id: 'evaluare',
    name: 'Meditații Evaluare Națională',
    price: 80,
    duration: '1.5 ore',
    description: 'Pregătire completă pentru Evaluarea Națională la matematică și română'
  },
  {
    id: 'bac',
    name: 'Meditații Bacalaureat',
    price: 100,
    duration: '2 ore',
    description: 'Pregătire intensivă pentru examenul de Bacalaureat'
  },
  {
    id: 'admitere',
    name: 'Meditații Admitere Universitate',
    price: 120,
    duration: '2 ore',
    description: 'Pregătire specializată pentru admiterea la universitate'
  }
];

export const availableHours = [
  '08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'
];

export const generateCalendar = () => {
  const today = new Date();
  const dates = [];
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Exclud weekendul
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push(date.toISOString().split('T')[0]);
    }
  }
  return dates;
};