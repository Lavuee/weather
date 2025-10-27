import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Weather {
  private apiKey = 'b8bb43a68229ea15f9ec40797f33ec58';
  private apiURL = 'http://api.weatherstack.com/current';

  constructor(private http: HttpClient){}

  getWeather(city: string): Observable<any>{
    const url = `${this.apiURL}?access_key=${this.apiKey}&query=${city}`;
    return this.http.get(url);
  }
}


