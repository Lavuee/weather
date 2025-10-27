import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weather } from '../services/weather';

@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';

  constructor(private weatherService: Weather){}

  getWeather(){
    this.weatherData = null;
    this.errorMessage = '';

    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
      },
      error: () => {
        this.errorMessage = 'City Not found or API Error';
      }
    });
  }
}
