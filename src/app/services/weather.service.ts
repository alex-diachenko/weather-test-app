import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WeatherModel } from "../models/weather.model";

@Injectable({ providedIn: 'root' })
export class WeatherService {
    private readonly _apiKey = environment.apiKey;

    constructor(private readonly http: HttpClient) {}

    getWeatherByCity(city: string): Observable<WeatherModel> {
        const reqString = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this._apiKey}`
        
        return this.http.get(reqString) as Observable<WeatherModel>;
    }
}