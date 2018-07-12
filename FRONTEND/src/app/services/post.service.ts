import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http:Http,
    private authService:AuthService
  ) { }

  getStudentPosts(dept,year){
    if(year==undefined||year==""){
      year='all';
    }
    return this.http.get("post/postsforstudents/"+dept+"/"+year)
      .map(res =>  res.json());
  }


  getHodPosts(dept){
    return this.http.get("post/postsforhods/"+dept)
    .map(res =>  res.json());
  }


  getTpoPosts(){
    return this.http.get("post/postsfortpos")
    .map(res =>  res.json());
  }


  postNotification(postObj){
    var headers=new Headers();
    headers.append('content-type','application/json');
    return this.http.post("post/sendpost",postObj,{headers:headers})
    .map(res => res.json());
  }
  updateNotification(postid,postObj){
    return this.http.put("post/updateposts/"+postid,postObj)
    .map(res =>  res.json());
  }
  deleteNotification(postid){
    return this.http.delete("post/deleteposts/"+postid)
    .map(res =>  res.json());
  }

  getPostsByRole(dept,year,role){
    return this.http.get("post/postsbyrole/" + dept + "/" + year + "/" + role)
      .map(res =>  res.json());
  }

}
