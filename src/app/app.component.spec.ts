import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WeatherService } from './services/weather.service';
import { of } from 'rxjs';
import { WeatherModel } from './models/weather.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let weatherServiceMock: jasmine.SpyObj<WeatherService>;

  const mockWeatherData: WeatherModel = {
    weather: [{ main: 'Clear', description: 'clear sky' }],
    main: { temp: 25, temp_min: 22, temp_max: 27, humidity: 60 },
    wind: { speed: 5 }
  } as WeatherModel;

  beforeEach(async () => {
    weatherServiceMock = jasmine.createSpyObj('WeatherService', ['getWeatherByCity']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, AppComponent],
      providers: [{ provide: WeatherService, useValue: weatherServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with an empty city control', () => {
    expect(component.weatherForm.value.city).toBe('');
  });

  it('should disable the "Get Weather" button when city input is empty', () => {
    const button = fixture.debugElement.query(By.css('.action-btn')).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it('should enable the "Get Weather" button when city input is valid', () => {
    component.weatherForm.controls['city'].setValue('New York');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.action-btn')).nativeElement;
    expect(button.disabled).toBeFalse();
  });

  it('should call WeatherService and update weatherData$ when showWeather() is called', fakeAsync(() => {
    component.weatherForm.controls['city'].setValue('New York');
    weatherServiceMock.getWeatherByCity.and.returnValue(of(mockWeatherData));

    component.showWeather();
    tick();
    fixture.detectChanges();

    expect(weatherServiceMock.getWeatherByCity).toHaveBeenCalledWith('New York');
    component.weatherObs$.subscribe((data) => {
      expect(data).toEqual(mockWeatherData);
    });
  }));

  it('should not call WeatherService when city input is empty', () => {
    component.weatherForm.controls['city'].setValue('   '); // Whitespace input
    component.showWeather();

    expect(weatherServiceMock.getWeatherByCity).not.toHaveBeenCalled();
  });

  it('should display weather data when weatherObs$ has data', fakeAsync(() => {
    component.weatherData$.next(mockWeatherData);
    fixture.detectChanges();
    tick();

    const description = fixture.debugElement.query(By.css('.data-result p:first-child'))
      .nativeElement.textContent;
    expect(description).toContain('Clear');
  }));
});
