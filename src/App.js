import logo from './logo.svg';
import './App.css';
import { Container, Box, Button, TextField, Card, CardContent, Typography, CircularProgress } from '@material-ui/core';
import "fontsource-roboto";
import { useState } from 'react';

const cityURL = 'https://corsanywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=';
const woeidURL = 'https://corsanywhere.herokuapp.com/https://www.metaweather.com/api/location/';
const imgURL = 'https://corsanywhere.herokuapp.com/https://www.metaweather.com/static/img/weather/';

function App() {
  const [query, setQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  function toF(cel){
    return Math.round((cel * 1.8) + 32);
  }

  function onType(event) {
    setQuery(event.target.value);
  }

  function fetchWeatherData() {
    setLoading(true);
    fetch(cityURL + query)
      .then(blob => blob.json())
      .then(data => {
        console.log(data);
        const city = data[0];
        const woeid = city.woeid;

    fetch(woeidURL + woeid)
      .then(blob => blob.json())
      .then(cityData => {
        console.log(cityData);
        const weeklyWeatherData = cityData.consolidated_weather;
        const data = weeklyWeatherData.map(day => {
          const highTemp = toF(day.max_temp);
          const lowTemp = toF(day.min_temp);
          const weatherState = day.weather_state_name;
          const abbr = day.weather_state_abbr;
          return {highTemp, lowTemp, weatherState, abbr};
        });
        setLoading(false);
        setWeatherData(data);
      })
    })
  }

  let output = null;
  if (loading){
    output = <CircularProgress />
  } else if (!loading && weatherData !== null) {
    output = <WeeklyForcast weather={weatherData}/>};
  return (
      <Container>
        <Box m={5}>
          <form>
            <TextField label='Enter a City!' onChange={onType} value={query} />
            <Button variant='contained'
            color='primary'
            onClick={fetchWeatherData}
            >Click me!
          </Button>
          </form>
        </Box>
      {output}
      </Container>
  );
}

function WeeklyForcast({ weather }) {
  return weather.map(day => <DailyForcast weather={day} />)
}

function DailyForcast({ weather }) {
    return (
      <Box display='inline-block' m={1}>
        <Card elevation={5}>
          <CardContent>
            <img style={{ height: 140 }} src={imgURL + weather.abbr + '.svg'} alt='Weather card'></img>
            <Typography>
              High: {weather.highTemp}<br />
              Low: {weather.lowTemp}<br />
              Weather: {weather.weatherState}
            </Typography>
          </CardContent>
      </Card>
    </Box>
  );
}


export default App;
