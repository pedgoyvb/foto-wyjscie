# Foto-Wyjście

Aplikacja mobilna stworzona w technologii React Native z użyciem Expo.  
Jej zadaniem jest pomoc w ocenie warunków do wyjścia fotograficznego na podstawie bieżącej lokalizacji użytkownika.

## Funkcje aplikacji
- pobieranie aktualnej lokalizacji użytkownika,
- wyświetlanie współrzędnych geograficznych,
- pobieranie aktualnej pogody z zewnętrznego API,
- pobieranie wysokości terenu dla aktualnej lokalizacji,
- wyświetlanie krótkiej interpretacji warunków pogodowych,
- ręczne odświeżanie danych.

## Wykorzystane technologie
- React Native
- Expo
- Expo Router
- TypeScript
- expo-location

## Wykorzystane API
- Open-Meteo Forecast API  
  https://open-meteo.com/en/docs
- Open-Meteo Elevation API  
  https://open-meteo.com/en/docs

## Działanie aplikacji
Po uruchomieniu aplikacja prosi użytkownika o zgodę na dostęp do lokalizacji.  
Po uzyskaniu zgody pobierane są współrzędne urządzenia.  
Następnie aplikacja wysyła zapytania do API Open-Meteo w celu pobrania:
- aktualnej temperatury,
- opadów,
- prędkości wiatru,
- wysokości terenu.

Na końcu dane są prezentowane na ekranie w prostym i czytelnym układzie.

## Uruchomienie projektu
1. Zainstaluj Node.js
2. Zainstaluj zależności:
   ```bash
   npm install
   npx expo install expo-location
   ```
3. Uruchom aplikację:
   ```bash
   npx expo start --tunnel
   ```
4. Otwórz projekt w aplikacji Expo Go

## Struktura projektu
- `app/(tabs)/index.tsx` – główny ekran aplikacji
- `app.json` – konfiguracja Expo
- `assets/` – pliki graficzne i zasoby

## Uprawnienia
Aplikacja wymaga dostępu do lokalizacji użytkownika.

## Autor
Kamil Domian