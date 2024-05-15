import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import { UserContext } from './App';

const url = "https://localhost:7038";
const apiPath = url + "/api/room" ;
const reservePath = apiPath + "/reserve" ;
const photoPath = url + "/img/content/";

function reducer(state, action) {
  let newState =  {...state};
  switch( action.type ) {
    case 'setRoom' : 
    console.log(action.payload.reservations);
      newState.room = action.payload; 
      newState.reservations = action.payload.reservations; 
      break;
  }
  return newState;
}

export default function Room() {
  const { slug } = useParams();
  const { user, token } = useContext(UserContext);
  
  const [state, dispatch] = useReducer(reducer, 
    { 
      room: {}, 
      reservations: [], 
      year: new Date().getFullYear(), 
      month: new Date().getMonth() 
    });

  useEffect(() => {
    loadRoom();
  }, [slug]);

  const loadRoom = useCallback( () => {
    fetch(`${apiPath}?slug=${slug}`, {method: 'PATCH'})
    .then(r => r.json()).then(j => dispatch({type:'setRoom', payload: j}));
  });

  let daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
  let firstMonthDay = new Date(state.year, state.month, 1).getDay();
  let today = new Date().getDate();

  const reserveClick = useCallback( (day) => {
    if( ! user ) {
      alert('Необхідно автентифікуватися');
      return;
    }
    if( today > day ) {
      alert('Неможна резервувати за минулі дати');
      return;
    }
    // оформлення бронювання - запит до API
    fetch(reservePath, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.id}`
      },
      body: JSON.stringify({
          date: new Date(state.year, state.month, day),
          roomId: state.room.id,
          userId: user.id
      })
    }).then(r => {
        if (r.status === 201) {
          loadRoom();
        }
        else {
          r.text().then(alert);
        }
    });
  } );

  // console.log(state.reservations);
  return <>
  <div className="row">
    <div className="col col-8">
      <h1>Апартамент: {state.room.name}</h1>
      {state.room.photoUrl && 
        <img src={photoPath + state.room.photoUrl} alt="room" className='room-image' />}
      <p>{state.room.description}</p>
    </div>
    <div className="col col-4">
      <div className="calendar">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => 
            <div className='calendar-item' key={d}>{d}</div>)}
        {Array.from( { length: firstMonthDay }, 
          (_, i) => <div className='calendar-item' key={i}></div> 
        )}
        {Array.from( { length: daysInMonth }, 
          (_, i) => <div onClick={() => reserveClick(i+1)}
            className={ 'calendar-item ' + (i+1 < today ? 'item-past' : ( state.reservations.find(r => false) ? 'item-reserved' : 'item-free')) } key={i + firstMonthDay}>{i + 1}</div>
        )}
        {Array.from( { length: 7 - (daysInMonth + firstMonthDay) % 7 }, 
          (_, i) => <div className='calendar-item' key={i + firstMonthDay + daysInMonth}></div> 
        )}
      </div>
    </div>
  </div>
    { user != null && user.role == "Admin" && <AdminRoom /> }
  </>; 
}

function AdminRoom() {

  return <>
  <h3>Управління кімнатою</h3>
  </>;
}
/*
Д.З. React: реалізувати різну стилізацію календаря замовлень - 
дати, на які номер заброньовано виводити іншим кольором, ніж
вільні.
Також у reserveClick забезпечити перевірку, що бронюється
вільний день.

ASP: Забезпечити перевірку токенів на термін придатності.
(рекомендовано у Middleware). Додати відповідь 401 Token expired

*/