import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './membership.model';

@Injectable()
export class MembershipService {
    public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    public options = ({ headers: this.headers });
    public url = 'api/users';
    constructor(public http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get(this.url).pipe(
                        map(this.extractData),
                        catchError(this.handleError));
    }

    addUser(user: User): Observable<User> {
        return this.http.post(this.url, user, this.options).pipe(
                        map(this.extractData),
                        catchError(this.handleError));
    }

    updateUser(user: User): Observable<User> {
        return this.http.put(this.url + '/' + user.id, user, this.options).pipe(
                        map(this.extractData),
                        catchError(this.handleError));
    }

    deleteUser(id: number) {
        return this.http.delete(this.url + '/' + id);
    }

    private extractData(res) {
        const  body = res.json();
        if (body) {
            return body.data || {};
        } else {
            return null
        }
    }
    private handleError(error: any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
}
