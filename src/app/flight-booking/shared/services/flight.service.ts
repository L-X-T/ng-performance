import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Flight } from '../../../entities/flight';

@Injectable({ providedIn: 'root' })
export class FlightService {
  url = 'http://www.angular.at/api/flight';
  // url = 'https://demo.angulararchitects.io/api/Flight';

  private flightsSubscription?: Subscription;
  private readonly flightsSubject = new BehaviorSubject<Flight[]>([]);
  flights$ = this.flightsSubject.asObservable();

  constructor(private http: HttpClient) {}

  find(from: string, to: string): Observable<Flight[]> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const params = new HttpParams().set('from', from).set('to', to);

    return this.http.get<Flight[]>(this.url, { headers, params });
  }

  findReactive(from: string, to: string): void {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const params = new HttpParams().set('from', from).set('to', to);

    this.flightsSubscription?.unsubscribe();
    this.flightsSubscription = this.http
      .get<Flight[]>(this.url, { headers, params })
      .subscribe((flights) => this.flightsSubject.next(flights));
  }

  delayFirstFlight(): void {
    if (this.flightsSubject.value.length > 0) {
      const ONE_MINUTE = 1000 * 60;
      const oldFlights = this.flightsSubject.value;
      const oldFlight = oldFlights[0];
      const oldDate = new Date(oldFlight.date);

      // Mutable
      oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
      oldFlight.date = oldDate.toISOString();

      this.flightsSubject.next(oldFlights);
    }
  }

  findById(id: string): Observable<Flight> {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    const params = new HttpParams().set('id', id);

    return this.http.get<Flight>(this.url, { params, headers });
  }

  save(flight: Flight): Observable<Flight> {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.post<Flight>(this.url, flight, { headers });
  }
}
