import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http:Http,
    private authService:AuthService
  ) { }
  tpoSearch(depts,years,minaggrigt){
    return this.http.get("student/tposearch?depts="+depts+"&years="+years+"&minaggrigt="+minaggrigt)
    .map(res => res.json());
  }

}
