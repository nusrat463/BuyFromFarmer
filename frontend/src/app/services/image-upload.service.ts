import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImage(file: File | null): Observable<string> {
    if (!file) {
      // Return an empty observable (nothing happens, completes silently)
      return new Observable<string>(observer => {
        observer.complete();
      });
    }
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/uploadImage`, formData, { responseType: 'text' });
  }


}
