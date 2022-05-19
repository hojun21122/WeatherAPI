import React, { useState } from 'react'

const api = {
  key: "d8d35644214893d27246767ed5474139",
  base: "https://api.openweathermap.org/data/2.5/"
}
function App() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const dateBuilder = (d) => {
    let months = ["January",'February','March','April','May','June','July','August','September','October','November','December'];
    let days = ['Monday','Tuesday', 'Wednesday', 'Thursday','Friday','Saturday','Sunday'];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
  const backgroundref = React.useRef();
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState('');

  const search = evt => {
    if(evt.key === "Enter"){
      fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result)
          setQuery('');
          var date = new Date(utc + 3600000*(result.timezone / 60 / 60) );
          changebackground(result, date);
        });
    }
  }

  const changebackground = (res, datevar)=>{
    if(res.main !== undefined){
      if(datevar.getHours() >= 7 && datevar.getHours() < 19){
          if(res.weather[0].main === "Clouds"){
            backgroundref.current.className = "app dayclouds"
          }else if(res.weather[0].main === "Clear"){
            backgroundref.current.className = "app dayclear"
          }else if(res.weather[0].main === "Rain"){
            backgroundref.current.className = "app dayrain"
          }else if(res.weather[0].main === "Snow"){
            backgroundref.current.className = "app daysnow"
          }
        }else{
          if(res.weather[0].main === "Clouds"){
            backgroundref.current.className = "app nightclouds"
          }else if(res.weather[0].main === "Clear"){
            backgroundref.current.className = "app nightclear"
          }else if(res.weather[0].main === "Rain"){
            backgroundref.current.className = "app nightrain"
          }else if(res.weather[0].main === "Snow"){
            backgroundref.current.className = "app nightsnow"
          }else{
            backgroundref.current.className = "app nightclouds"
          }
        }
      }
    }
  
  return (
    <div ref={backgroundref} className="app">
      <main>
        <div className='search-box'>
          <input
            type="text"
            className='search-bar'
            placeholder='search...'
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}/>
        </div>
        {(typeof weather.main != "undefined")?(
          <div className='weather-area'>
              <div className='location-box'>
                <div className='location'> {weather.name}, {weather.sys.country}</div>
                <div className='date'>{dateBuilder(new Date())}</div>
                <div className='time'>{new Date(utc + 3600000*(weather.timezone / 60 / 60)).toLocaleTimeString()}</div>
              </div>
            <div className='weather-box'>
              <div className='temp'> {Math.round(weather.main.temp)}˚C</div>
              <div className='weather'>{weather.weather[0].main}</div>
            </div>
          </div>
        ) : (
        <div className='empty_holder'>
          <p> Search for weather forecast</p>
        </div>
        )}
       
      </main>
    </div>
  );
}

export default App;
