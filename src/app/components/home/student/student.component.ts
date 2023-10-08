import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CredentialResponse } from 'src/app/auth/model/auth/credentialResponse';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
    constructor(public authService: AuthService){ }

    user !: CredentialResponse;

    ngOnInit(): void {
        this.user = this.authService.LoggedUser;
    }
}
