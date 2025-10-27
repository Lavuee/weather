import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weather } from '../services/weather';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnDestroy {
  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  // 🌡️ Feature: Temperature Unit Toggle
  unit: 'C' | 'F' = 'C';

  // 🌍 Feature: Search History
  recentCities: string[] = [];

  // 🔁 Feature: Auto Refresh
  autoRefreshSub?: Subscription;
  refreshInterval = 60; // seconds

  constructor(private weatherService: Weather) {}

  // 🌤️ Fetch weather
  getWeather() {
    if (!this.city.trim()) return;

    this.weatherData = null;
    this.errorMessage = '';
    this.isLoading = true;

    // Save to history
    this.addToHistory(this.city);

    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        if (data.success === false) {
          this.errorMessage = data.error?.info || 'Invalid city name';
        } else {
          this.weatherData = data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'City not found or API Error';
        this.isLoading = false;
      }
    });
  }

  // 🌍 Save to history
  addToHistory(city: string) {
    const formatted = city.trim();
    if (!formatted) return;
    if (!this.recentCities.includes(formatted)) {
      this.recentCities.unshift(formatted);
      if (this.recentCities.length > 5) this.recentCities.pop();
    }
  }

  // 🌡️ Convert temperature based on unit
  displayTemp(tempC: number): string {
    if (this.unit === 'F') {
      const f = (tempC * 9) / 5 + 32;
      return `${tempC}°C / ${f.toFixed(1)}°F`;
    }
    return `${tempC}°C`;
  }

  // 🎨 Dynamic background color
  getBackgroundColor(): string {
    if (!this.weatherData) return '#ffffff';
    const desc = this.weatherData.current.weather_descriptions[0].toLowerCase();
    if (desc.includes('rain')) return '#a3d5ff';
    if (desc.includes('cloud')) return '#dcdcdc';
    if (desc.includes('sun')) return '#ffe680';
    if (desc.includes('clear')) return '#f7f7b0';
    return '#ffffff';
  }

  // 🔁 Auto Refresh (every 60 seconds)
  toggleAutoRefresh() {
    if (this.autoRefreshSub) {
      this.autoRefreshSub.unsubscribe();
      this.autoRefreshSub = undefined;
    } else if (this.city.trim()) {
      this.autoRefreshSub = interval(this.refreshInterval * 1000).subscribe(() => {
        this.getWeather();
      });
    }
  }

  ngOnDestroy() {
    this.autoRefreshSub?.unsubscribe();
  }
}
