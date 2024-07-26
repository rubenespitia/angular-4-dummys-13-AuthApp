import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../../enviroments/environments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, of, tap, throwError } from "rxjs";
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from "../../interfaces";



@Injectable({
  providedIn: 'root'
})

export class AuthService{

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient)

  private _currentUser = signal<User|null>(null);

  private _authStatus = signal<AuthStatus>(AuthStatus.checking);


  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor(){
    this.checkAuthStatus().subscribe();
  }

  login(email: string, password: string):Observable<boolean>{

    const url = `${this.baseUrl}/auth/login`;

    const body = {email,password};

    return this.http.post<LoginResponse>(url,body)
    .pipe(
      tap(({user,token})=>{
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token',token)
        console.log(localStorage.getItem('token'));
        console.log('hi');
      }),
      map(()=>true),

      catchError(err => {
        console.log(err)
        return throwError(() => err.error.message);
      })
    )
  }

  checkAuthStatus():Observable<boolean>{
    const url = `${this.baseUrl}/auth/check-token`;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTgzYzEyMWU2ZGM5MTk1YWI4OTVjYiIsImlhdCI6MTcyMTk0Mjc5MCwiZXhwIjoxNzIxOTY0MzkwfQ.jbMRteyDQpqpIjdru8AXJNJ8Gw06ZOvYNpJZDs2lD_I';
    //const token = localStorage.getItem('token');

    if(!token){
      this.logout();
      return of(false)};

    const headers = new HttpHeaders()
    .set('Authorization',`Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, {headers})
    .pipe(
      map(({token,user})=> {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token',token)
        
        return true;
      }),
      catchError(()=> {
        this._authStatus.set(AuthStatus.noAuthenticated)
        return of(false)
      })
    )
  }

  logout(){
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.noAuthenticated);
  }
}
