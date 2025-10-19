
        const API_KEY = '68c3b8a164bc12d0fc01df484ded8aa3';
        const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

        function showError(message) {
            const error = document.getElementById('error');
            error.textContent = message;
            error.classList.add('show');
            setTimeout(() => error.classList.remove('show'), 5000);
        }

        function showLoading(show) {
            const loading = document.getElementById('loading');
            loading.classList.toggle('show', show);
        }

        function getWeatherIcon(code) {
            const icons = {
                '01d': '☀️', '01n': '🌙',
                '02d': '⛅', '02n': '☁️',
                '03d': '☁️', '03n': '☁️',
                '04d': '☁️', '04n': '☁️',
                '09d': '🌧️', '09n': '🌧️',
                '10d': '🌦️', '10n': '🌧️',
                '11d': '⛈️', '11n': '⛈️',
                '13d': '❄️', '13n': '❄️',
                '50d': '🌫️', '50n': '🌫️'
            };
            return icons[code] || '🌤️';
        }

        function displayWeather(data) {
            document.getElementById('locationName').textContent = 
                `${data.name}, ${data.sys.country}`;
            document.getElementById('description').textContent = 
                data.weather[0].description;
            document.getElementById('temperature').textContent = 
                `${Math.round(data.main.temp)}°C`;
            document.getElementById('feelsLike').textContent = 
                `${Math.round(data.main.feels_like)}°C`;
            document.getElementById('humidity').textContent = 
                `${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = 
                `${Math.round(data.wind.speed * 3.6)} km/h`;
            document.getElementById('pressure').textContent = 
                `${data.main.pressure} hPa`;
            document.getElementById('weatherIcon').textContent = 
                getWeatherIcon(data.weather[0].icon);
            
            // Additional details
            document.getElementById('visibility').textContent = 
                `${(data.visibility / 1000).toFixed(1)} km`;
            document.getElementById('clouds').textContent = 
                `${data.clouds.all}%`;
            document.getElementById('uvIndex').textContent = 
                data.uvi || 'N/A';
            
            document.getElementById('weatherCard').classList.add('show');
        }

        async function fetchWeather(url) {
            try {
                showLoading(true);
                const response = await fetch(url);
                showLoading(false);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('City not found. Please check spelling.');
                    }
                    throw new Error('Unable to fetch weather data.');
                }

                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                showLoading(false);
                showError(error.message);
            }
        }

        function searchWeather() {
            const city = document.getElementById('cityInput').value.trim();
            
            if (!city) {
                showError('Please enter a city name');
                return;
            }

            const url = `${API_BASE}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
            fetchWeather(url);
        }

        function getLocationWeather() {
            if (!navigator.geolocation) {
                showError('Geolocation is not supported by your browser');
                return;
            }

            showLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const url = `${API_BASE}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                    fetchWeather(url);
                },
                (error) => {
                    showLoading(false);
                    showError('Unable to get your location. Please enter a city manually.');
                }
            );
        }

        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchWeather();
            }
        });

        
        window.addEventListener('load', () => {
            document.getElementById('cityInput').value = 'Pune';
            searchWeather();
        });
    