import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { environment } from "src/environments/environment";
export interface authResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    register?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenTimer: any
    constructor(private http: HttpClient, private router: Router) {

    }
    signUp(email: string, password: string) {
        return this.http.post<authResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }))
    }

    login(email: string, password: string) {
        return this.http.post<authResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }))
    }

    logout() {
        this.user.next(null)
        this.router.navigate(['/auth'])
        localStorage.removeItem('userData')
        if (this.tokenTimer) {
            clearTimeout(this.tokenTimer)
        }
        this.tokenTimer = null
    }

    autoLogout(expirationDuration: number) {
        this.tokenTimer = setTimeout(() => { this.logout() }, expirationDuration)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + (expiresIn) * 1000);
        const user = new User(email, userId, token, expirationDate)
        this.user.next(user)
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    autoLogin() {
        const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'))
        if (!userData) {
            return
        } else {
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

            if (loadedUser.token) {
                this.user.next(loadedUser)
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                this.autoLogout(expirationDuration)
            }
        }
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = "An unkown error occurred"

        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage)
        }
        switch (errorRes.error.error.message) {
            case "EMAIL_EXISTS": {
                errorMessage = " This email is already registered"
            }
            case "EMAIL_NOT_FOUND": {
                errorMessage = " This email is not associated with any accounts"
            }
            case "INVALID_PASSWORD": {
                errorMessage = " Incorrect password"
            }
            case "OPERATION_NOT_ALLOWED": {
                errorMessage = " Sign-in was disabled in this project"
            }
            case "TOO_MANY_ATTEMPTS_TRY_LATER": {
                errorMessage = " Too many attempts were made, try again later"
            }

        }
        return throwError(errorMessage)

    }
}