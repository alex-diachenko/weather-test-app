import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { WeatherService } from './services/weather.service';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { WeatherModel } from './models/weather.model';
import { MyErrorStateMatcher } from './shared/classes/error-matcher.class';
import { RoundPipe } from './pipes/round.pipe';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule,
    RoundPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  weatherData$: BehaviorSubject<WeatherModel | null> =
    new BehaviorSubject<WeatherModel | null>(null);
  weatherObs$: Observable<null | WeatherModel> =
    this.weatherData$.asObservable();

  weatherForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  error: string = '';

  constructor(private readonly weatherService: WeatherService) {
    this.weatherObs$ = this.weatherData$.asObservable();
  }

  ngOnInit(): void {
    this.createForm();
  }

  showWeather(): void {
    if (!this.weatherForm.value.city?.trim()) return;

    this.resetData();

    this.weatherService
      .getWeatherByCity(this.weatherForm.value.city.trim())
      .pipe(
        tap((data: WeatherModel) => this.weatherData$.next(data)),
        catchError((err) => (this.error = err.error.message))
      )
      .subscribe();
  }

  private createForm(): void {
    this.weatherForm = new FormGroup({
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }

  private resetData(): void {
    this.weatherData$.next(null);
    this.error = '';
  }
}
