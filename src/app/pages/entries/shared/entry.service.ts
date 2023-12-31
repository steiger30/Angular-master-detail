import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiPath: string = 'api/entries';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: any): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry> {
    const params = {
      "name": entry.name,
      "description": entry.description,
    }
    return this.http.post(this.apiPath, params).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }
  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    )
  }
  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //PRIVATE METHODS

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign( new Entry(), element);
      entries.push(entry);
    });
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign( new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(() => error);
  }
}
