import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {emailExistsValidator, usernameExistsValidator} from "../../validators/validator";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm!: FormGroup;
  constructor(private fb: FormBuilder,private auth: AuthService, private router: Router,
              private snackBar: MatSnackBar,private http: HttpClient) {
    this.registerForm = this.fb.group({
      name: ['',
        [Validators.required],
        [usernameExistsValidator(this.http)]
      ],
      email: ['',
        [Validators.required, Validators.email],
        [emailExistsValidator(this.http)]
      ],
      username: ['',
        [Validators.required],
        [usernameExistsValidator(this.http)]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get f() {
    return this.registerForm.controls;
  }

  register() {
    if (this.registerForm.invalid) return;

    this.auth.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.snackBar.open('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.error || 'Registration failed');
      }
    });
  }

}
