"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, Spinner } from '.'
import axios from 'axios'
import { ICall, IClient, IPayment, IService } from '@/interfaces'
import { usePathname, useRouter } from 'next/navigation'
import { io } from 'socket.io-client'
import { CardPayment, initMercadoPago, StatusScreen } from '@mercadopago/sdk-react'
import Cookies from 'js-cookie'

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

type CalendarProps = {
  newClient: IClient
  setNewClient: any
  tags: string[]
  meeting: string
  call: ICall
  payment: IPayment
  services?: IService[]
  style?: any
};

interface DateData {
  date: Date;
  hours: number[];
}

declare global {
  interface Window {
    MercadoPago: any;
    cardPaymentBrickController: any;
  }
}

declare const fbq: Function

export const Calendar: React.FC<CalendarProps> = ({ newClient, setNewClient, tags, meeting, call, payment, services, style }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<DateData[]>([]);
  const [loading, setLoading] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [error, setError] = useState('')
  const [initialization, setInitialization] = useState({ amount: Number(call.price) })
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(true)

  const clientRef: any = useRef(newClient);
  const selectDate: any = useRef(selectedDateTime)
  const initializationRef = useRef(initialization)
  const paymentIdRef = useRef(null)

  const router = useRouter()
  const pathname = usePathname()

  initMercadoPago(payment.mercadoPago.publicKey!)

  const getDates = async () => {
      try {
          const currentDate = new Date(); // Obtener la fecha y hora actual
          const currentHour = currentDate.getHours(); // Obtener la hora actual
          const currentMinutes = currentDate.getMinutes(); // Obtener los minutos actuales
    
          // Obtener las fechas ya agendadas
          const meetingsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/meetings`);
          const meetings = meetingsRes.data.map((meeting: any) => new Date(meeting.date));
    
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/calendar`);
          const datesWithConvertedDates = res.data.dates.map((dateItem: any) => ({
              ...dateItem,
              date: new Date(dateItem.date)
          }));
    
          // Función para generar intervalos de 15 minutos como cadenas de texto
          const generateTimeIntervals = (hours: number[]) => {
              const intervals: any = [];
              
              // Variable para llevar el control de las horas y minutos acumulados
              let currentTime = hours[0] * 60; // Convierte la primera hora a minutos (por ejemplo, 10:00 => 600 minutos)
              
              // Recorrer todas las horas disponibles
              hours.forEach(hour => {
                  // Mientras la hora sea menor a 24 horas
                  while (Math.floor(currentTime / 60) < 24) {
                      const currentHour = Math.floor(currentTime / 60); // Obtener la hora actual
                      const currentMinutes = currentTime % 60; // Obtener los minutos actuales
                      
                      // Asegurarse de que la hora está dentro de las horas proporcionadas
                      if (hours.includes(currentHour)) {
                          intervals.push(`${currentHour}:${currentMinutes.toString().padStart(2, '0')}`);
                      }
                      
                      currentTime += parseInt(call.duration); // Sumar la duración para el siguiente intervalo
                  }
              });
              
              return intervals;
          };
    
          // Filtrar las fechas pasadas y las horas pasadas para los días pasados
          const filteredDates = datesWithConvertedDates.map((dateData: any) => {
              if (dateData.date < currentDate.setHours(0, 0, 0, 0)) return null; // Eliminar fechas pasadas
              if (dateData.date.getDate() === currentDate.getDate()) {
                  // Si la fecha es la actual, filtrar las horas pasadas
                  const startHour = currentHour < 2 ? 0 : currentHour + 2; // Si son las 2:00 o más tarde, comenzar desde 2 horas después de la hora actual
                  const filteredHours = dateData.hours.filter((hour: number) => hour >= startHour);
                  const intervals = generateTimeIntervals(filteredHours);
                  const filteredIntervals = intervals.filter((interval: any) => {
                      const [hour, minutes] = interval.split(':').map(Number);
                      if (hour === currentHour) {
                          return minutes > currentMinutes;
                      }
                      return true;
                  });
                  return {
                      ...dateData,
                      hours: filteredIntervals
                  };
              }
              const intervals = generateTimeIntervals(dateData.hours);
              return {
                  ...dateData,
                  hours: intervals
              };
          }).filter((dateData: any) => dateData !== null); // Eliminar fechas pasadas
    
          // Filtrar horas ya agendadas para las fechas disponibles
          const filteredAvailableDates = filteredDates.map((dateData: any) => {
              const filteredHours = dateData.hours.filter((interval: string) => {
                  const [hour, minutes] = interval.split(':').map(Number);
                  const meetingDate = new Date(dateData.date);
                  meetingDate.setHours(hour, minutes);
                  // Verificar si la hora está agendada
                  return !meetings.some((meetingDateItem: Date) => {
                      return meetingDateItem.getTime() === meetingDate.getTime();
                  });
              });
              return {
                  ...dateData,
                  hours: filteredHours
              };
          });
    
          setAvailableDates(filteredAvailableDates);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  useEffect(() => {
    getDates();
  }, []);

  const handleChangeMonth = (increment: number): void => {
    setDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + increment);
      return newDate;
    });
  };

  const handleDateTimeSelect = (selectedDate: Date): void => {
    setSelectedDateTime(selectedDate);
    selectDate.current = selectedDate
  };

  const handleHourSelect = (time: string): void => {
    if (selectedDateTime) {
      const selectedDateWithTime = new Date(selectedDateTime);
      const [hour, minutes] = time.split(':').map(Number);
      selectedDateWithTime.setHours(hour, minutes);
      setSelectedDateTime(selectedDateWithTime);
      selectDate.current = selectedDateWithTime
    }
  };
  
  const isTimeSelected = (time: string): boolean => {
    if (!selectedDateTime) return false;
    const [selectedHour, selectedMinutes] = time.split(':').map(Number);
    return selectedDateTime.getHours() === selectedHour && selectedDateTime.getMinutes() === selectedMinutes;
  };

  const onSubmit = async (formData: any) => {
    // callback llamado al hacer clic en el botón enviar datos
    if (!loading) {
      setLoading(true)
      setError('')
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let valid = true;
      let errorMessage = ''
      call.labels?.forEach((label) => {
        const value = label.data === 'phone' ? newClient[label.data] : newClient.data?.find(dat => dat.name === label.data)?.value || newClient[label.data]
        if (label.data && (!value || value.trim() === '')) {
          valid = false;
          errorMessage = `Por favor, completa el campo ${label.text || label.name}.`;
        }
      })
      if (newClient.email && !emailRegex.test(newClient.email)) {
        valid = false
        errorMessage = 'Has ingresado un correo inválido'
      }
      if (!valid) {
        setError(errorMessage)
        setLoading(false)
        return
      }
      return new Promise<void>((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/process_payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then(async (response) => {
            console.log(response)
            paymentIdRef.current = response.id
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
            let respo
            let stepFind
            if (res.data) {
              respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
              stepFind = respo.data.steps.find((ste: any) => `/${ste.slug}` === pathname)
            }
            const newEventId = new Date().getTime().toString()
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/meeting`, { ...clientRef.current, date: selectDate.current, tags: tags, meeting: meeting, call: call.nameMeeting, duration: call.duration === '15 minutos' ? 15 : call.duration === '30 minutos' ? 30 : call.duration === '45 minutos' ? 45 : call.duration === '1 hora' ? 60 : 60, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), page: pathname, service: clientRef.current.services?.length && clientRef.current.services[0].service && clientRef.current.services[0].service !== '' ? clientRef.current.services[0].service : undefined, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, funnel: respo?.data._id, step: stepFind?._id, eventId: newEventId, price: call.price })
            fbq('track', 'Schedule', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: call._id, currency: "clp", value: call.price, contents: { id: call._id, item_price: call.price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
            socket.emit('newNotification', { title: 'Nueva llamada agendada:', description: meeting, url: '/llamadas', view: false })
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nueva llamada agendada:', description: call.nameMeeting, url: '/llamadas', view: false })
            if (call.action === 'Mostrar mensaje') {
              setScheduled(true)
            } else if (call.action === 'Ir a una pagina') {
              router.push(call.redirect!)
            }
            resolve();
          })
          .catch((error) => {
            // manejar la respuesta de error al intentar crear el pago
            reject();
          })
      })
    }
  }

  const statusScreenBrick = useMemo(() => {
    if (paymentCompleted && paymentIdRef.current) {
      return (
        <StatusScreen
          initialization={{
            paymentId: paymentIdRef.current
          }}
          customization={{
            visual: {
              hideStatusDetails: true,
              hideTransactionDate: true,
              style: {
                theme: 'default', // Cambia el tema según sea necesario
              }
            },
            backUrls: {
              error: `${process.env.NEXT_PUBLIC_WEB_URL}`,
              return: process.env.NEXT_PUBLIC_WEB_URL,
            },
          }}
          onError={(error) => console.error("Error in status screen:", error)}
        />
      )
    }
    return null
  }, [paymentCompleted, paymentIdRef.current])
   
  const onError = async (error: any) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error);
  };
   
  const onReady = async () => {
    setLoadingPayment(false)
  };

  const cardPaymentMemo = useMemo(() => {
    if (typeof initializationRef.current.amount === 'number' && initializationRef.current.amount > 0) {
      <CardPayment
        initialization={initializationRef.current}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!loading) {
      setLoading(true)
      setError('')
      let valid = true;
      let errorMessage = ''
      call.labels?.forEach((label) => {
        const value = label.data === 'phone' ? newClient[label.data] : newClient.data?.find(dat => dat.name === label.data)?.value || newClient[label.data]
        if (label.data && (!value || value.trim() === '')) {
          valid = false;
          errorMessage = `Por favor, completa el campo ${label.text || label.name}.`;
        }
      })
      if (newClient.email && !emailRegex.test(newClient.email)) {
        valid = false
        errorMessage = 'Has ingresado un correo inválido'
      }
      if (!valid) {
        setError(errorMessage)
        setLoading(false)
        return
      }
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      let respo
      let stepFind
      if (res.data) {
        respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
        stepFind = respo.data.steps.find((ste: any) => `/${ste.slug}` === pathname)
      }
      const newEventId = new Date().getTime().toString()
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/meeting`, { ...newClient, date: selectedDateTime, tags: tags, meeting: meeting, call: call.nameMeeting, duration: call.duration === '15 minutos' ? 15 : call.duration === '30 minutos' ? 30 : call.duration === '45 minutos' ? 45 : call.duration === '1 hora' ? 60 : 60, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), page: pathname, service: newClient.services?.length && newClient.services[0].service && newClient.services[0].service !== '' ? newClient.services[0].service : undefined, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, funnel: respo?.data._id, step: stepFind?._id, eventId: newEventId })
      fbq('track', 'Schedule', { first_name: newClient.firstName, last_name: newClient.lastName, email: newClient.email, phone: newClient.phone && newClient.phone !== '' ? `56${newClient.phone}` : undefined, content_name: call._id, currency: "clp", value: call.price, contents: { id: call._id, item_price: call.price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      socket.emit('newNotification', { title: 'Nueva llamada agendada:', description: meeting, url: '/llamadas', view: false })
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nueva llamada agendada:', description: meeting, url: '/llamadas', view: false })
      if (call.action === 'Mostrar mensaje') {
        setScheduled(true)
      } else if (call.action === 'Ir a una pagina') {
        router.push(call.redirect!)
      }
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 h-full">
      {
        scheduled
          ? (
            <div className='flex flex-col gap-4 m-auto text-center'>
              <p className='text-xl font-medium'>Llamada agendada exitosamente</p>
              <p>{call.message}</p>
            </div>
          )
          : (
            <>
              <div className='flex flex-col gap-6'>
                <div className="flex gap-6 items-center m-auto">
                  <button onClick={() => handleChangeMonth(-1)} className="text-gray-600 hover:text-gray-800">&lt;</button>
                  <p className="text-lg font-semibold">{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</p>
                  <button onClick={() => handleChangeMonth(1)} className="text-gray-600 hover:text-gray-800">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  <div className="text-center font-semibold text-gray-600">Dom</div>
                  <div className="text-center font-semibold text-gray-600">Lun</div>
                  <div className="text-center font-semibold text-gray-600">Mar</div>
                  <div className="text-center font-semibold text-gray-600">Mié</div>
                  <div className="text-center font-semibold text-gray-600">Jue</div>
                  <div className="text-center font-semibold text-gray-600">Vie</div>
                  <div className="text-center font-semibold text-gray-600">Sáb</div>
                  {renderCalendar()}
                </div>
              </div>
              {selectedDateTime && (
                <div className='flex flex-col gap-2'>
                  <p className='text-lg font-semibold'>Elige la hora</p>
                  {
                    availableDates
                    .find(item => item.date.toDateString() === selectedDateTime.toDateString())
                    ?.hours.length
                      ? <div className="grid grid-cols-4 gap-2">
                          {availableDates
                          .find(item => item.date.toDateString() === selectedDateTime.toDateString())
                          ?.hours
                          .sort((a, b) => a - b) // Ordenar las horas
                          .map(hour => (
                            <button
                              key={hour}
                              onClick={() => handleHourSelect(hour.toString())}
                              className={`p-2 rounded-xl text-center ${isTimeSelected(hour.toString()) ? 'bg-main text-white shadow-md shadow-main/30' : 'bg-gray-100 text-gray-600 hover:bg-main hover:text-white'} transition-colors duration-200`}
                            >
                              {hour}
                            </button>
                          ))}
                        </div>
                      : <p className='w-full'>No hay horas disponibles para este día</p>
                  }
                </div>
              )}
              {selectedDateTime && selectedDateTime?.getHours() !== 0 && (
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                  {
                    error !== ''
                      ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                      : ''
                  }
                  <p className='text-lg font-semibold'>Completa tus datos</p>
                  {
                    call.labels?.map(label => (
                      <div key={label._id} className="flex flex-col gap-2">
                        <p>{label.text !== '' ? label.text : label.name}</p>
                        <div className='flex gap-2'>
                          {
                            label.data === 'phone'
                              ? <p className='my-auto'>+56</p>
                              : ''
                          }
                          <Input
                            style={style}
                            placeholder={label.name}
                            value={newClient.data?.find(dat => dat.name === label.name)?.value || newClient[label.data]}
                            inputChange={(e: any) => {
                              if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                setNewClient({ ...newClient, [label.data]: e.target.value })
                                clientRef.current = { ...newClient, [label.data]: e.target.value }
                              } else if (Array.isArray(newClient.data)) {
                                const oldData = [...newClient.data];
                                const existingData = oldData.find(dat => dat.name === label.data);

                                if (existingData) {
                                  existingData.value = e.target.value;
                                } else {
                                  oldData.push({ name: label.data, value: e.target.value });
                                }

                                setNewClient({ ...newClient, data: oldData });
                                clientRef.current = { ...newClient, data: oldData }
                              } else {
                                setNewClient({ ...newClient, data: [{ name: label.data, value: e.target.value }] });
                                clientRef.current = { ...newClient, data: [{ name: label.data, value: e.target.value }] }
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))
                  }
                  {
                    call.price && call.price !== ''
                      ? (
                        <>
                          {loadingPayment ? (
                            <div className='flex w-full h-[748px] bg-white rounded-xl'>
                              <div className='w-fit h-fit m-auto'><Spinner /></div>
                            </div>
                          ) : null}
                          {paymentCompleted ? statusScreenBrick : cardPaymentMemo}
                          <div id="cardPaymentBrick_container"></div>
                        </>
                      )
                      : <Button type='submit' loading={loading} config='w-full' style={style}>{call.buttonText && call.buttonText !== '' ? call.buttonText : 'Agendar llamada'}</Button>
                  }
                </form>
              )}
            </>
          )
      } 
    </div>
  );

  function renderCalendar(): JSX.Element[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    const startingDay = new Date(year, month, 1).getDay();

    const days: JSX.Element[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let i = 1; i <= daysCount; i++) {
      const currentDate = new Date(year, month, i);
      const dateData = availableDates.find(item => item.date.toDateString() === currentDate.toDateString());
      const isAvailable = dateData !== undefined;
      const isSelected = selectedDateTime && currentDate.toDateString() === selectedDateTime.toDateString();
      days.push(
        <button 
          key={i} 
          disabled={!isAvailable} 
          className={`w-12 h-12 m-auto flex rounded-full ${isAvailable ? (isSelected ? 'bg-main text-white shadow-md shadow-main/30' : 'bg-gray-100 hover:bg-main hover:text-white') : ''} transition-color duration-150`} 
          onClick={() => handleDateTimeSelect(currentDate)}
        >
          <p className='m-auto'>{i}</p>
        </button>
      );
    }

    return days;
  }
};