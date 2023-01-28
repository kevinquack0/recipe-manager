import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { authResponseData, AuthService } from "./auth.service";


@Component({
    selector: "app-auth",
    templateUrl: "./auth.component.html"
})

export class AuthComponent {
    loginMode: boolean = true;
    isLoading: boolean = false;
    error: string = null;
    constructor(private authService: AuthService, private router: Router) { }
    onSwitchMode() {
        this.loginMode = !this.loginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return
        }
        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<authResponseData>

        this.isLoading = true
        if (this.loginMode) {
            authObs = this.authService.login(email, password)
        } else {
            authObs = this.authService.signUp(email, password)
        }

        authObs.subscribe(responseData => {
            console.log("responseData", responseData)
            this.isLoading = false
            this.router.navigate(['/recipes'])
        }, errorMessage => {
            this.error = errorMessage
            console.log("error", errorMessage)
            this.isLoading = false
        })


        form.reset()
    }

    private handleError(errorRes: HttpErrorResponse) {

    }

}