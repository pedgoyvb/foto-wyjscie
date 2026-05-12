import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';

type LocationData = {
  latitude: number;
  longitude: number;
};

type WeatherData = {
  temperature_2m: number;
  precipitation: number;
  wind_speed_10m: number;
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [elevation, setElevation] = useState<number | null>(null);

  const getInterpretation = () => {
    if (!weather || elevation === null) return '';

    const temp = weather.temperature_2m;
    const wind = weather.wind_speed_10m;
    const precipitation = weather.precipitation;

    if (precipitation > 0.5) {
      return 'Może padać, więc warunki na foto-wyjście nie są idealne.';
    }

    if (wind > 25) {
      return 'Jest dość wietrznie, warto dobrze przygotować się na wyjście.';
    }

    if (temp >= 15 && temp <= 25) {
      return 'Warunki wydają się dobre na krótki spacer fotograficzny.';
    }

    if (temp < 10) {
      return 'Jest chłodno, warto ubrać się cieplej przed wyjściem.';
    }

    return 'Warunki są umiarkowane, można zaplanować wyjście.';
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      setPermissionDenied(false);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      setLocation({ latitude, longitude });

      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m`;

      const elevationUrl =
        `https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`;

      const [weatherResponse, elevationResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(elevationUrl),
      ]);

      if (!weatherResponse.ok) {
        throw new Error('Błąd podczas pobierania pogody.');
      }

      if (!elevationResponse.ok) {
        throw new Error('Błąd podczas pobierania wysokości terenu.');
      }

      const weatherData = await weatherResponse.json();
      const elevationData = await elevationResponse.json();

      setWeather(weatherData.current);
      setElevation(elevationData.elevation[0]);
    } catch (err: any) {
      setError(err.message || 'Wystąpił nieznany błąd.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Foto-Wyjście</Text>
      <Text style={styles.subtitle}>
        Pogoda i wysokość terenu dla Twojej lokalizacji
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Odśwież dane" onPress={fetchData} />
      </View>

      {loading && <ActivityIndicator size="large" color="#2563eb" />}

      {permissionDenied && (
        <Text style={styles.error}>
          Nie przyznano uprawnień do lokalizacji.
        </Text>
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}

      {location && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lokalizacja</Text>
          <Text>Szerokość: {location.latitude.toFixed(4)}</Text>
          <Text>Długość: {location.longitude.toFixed(4)}</Text>
        </View>
      )}

      {weather && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pogoda teraz</Text>
          <Text>Temperatura: {weather.temperature_2m} °C</Text>
          <Text>Opady: {weather.precipitation} mm</Text>
          <Text>Wiatr: {weather.wind_speed_10m} km/h</Text>
        </View>
      )}

      {elevation !== null && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wysokość terenu</Text>
          <Text>{elevation} m n.p.m.</Text>
        </View>
      )}

      {weather && elevation !== null && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Interpretacja</Text>
          <Text>{getInterpretation()}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#f8fafc',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#475569',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
});