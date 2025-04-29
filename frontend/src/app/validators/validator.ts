import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, debounceTime, switchMap, first } from 'rxjs';

export function usernameExistsValidator(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return control.valueChanges.pipe(
      debounceTime(500),
      switchMap(value =>
        http.get<any>(`http://localhost:8038/api/check-username?username=${value}`)
      ),
      map(res => res.exists ? { usernameTaken: true } : null),
      first()
    );
  };
}

export function emailExistsValidator(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return control.valueChanges.pipe(
      debounceTime(500),
      switchMap(value =>
        http.get<any>(`http://localhost:8038/api/check-email?email=${value}`)
      ),
      map(res => res.exists ? { emailTaken: true } : null),
      first()
    );
  };
}
