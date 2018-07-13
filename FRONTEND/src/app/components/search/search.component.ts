import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../models/student';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  dept:string;
  year:string;
  minaggrigt:Number;
  students: Student[];
  student: Student;
  tpodepts:any[];
  tpoyears:any[];
  tpoResult:any[];
  tpotable:Boolean=false;

  constructor(private authService:AuthService,
  private flashmessage:FlashMessagesService,
  private searchService:SearchService,
  private router:Router
) { }

  ngOnInit() {
    this.students=[];
    this.tpodepts=[];
    this.tpoyears=[];
    this.tpoResult=[];
  }

  onSearchSubmit(){
    var basedon={
      dept:this.dept,
      year:this.year
    }
    this.authService.SearchStudents(basedon)
      .subscribe(results =>{
        if(results.length==0){
          this.flashmessage.show("No result found.",{cssClass:'alert-danger text-center',timeOut:2000});
          this.students=[];
        }else{
          this.students=results;
        }
      });
    }

    onHodSearchSubmit(){
      var hod = JSON.parse(localStorage.getItem('user'));
      var basedon={
        dept:hod.dept,
        year:this.year
      }
      this.authService.SearchStudents(basedon)
        .subscribe(results =>{
          if(results.length==0){
            this.flashmessage.show("No result found.",{cssClass:'alert-danger text-center',timeOut:2000});
            this.students=[];
          }else{
            this.students=results;
          }
        });
      }

  hasResult(){
    if(this.students.length!=0||this.tpoResult.length!=0)
    return true;
    else
    return false;
  }

  selectdepts(ev){
    if(ev.currentTarget.checked){
      this.tpodepts.push(ev.target.defaultValue);
      console.log("TPO Depts: "+this.tpodepts);}
    else{
      var out=this.tpodepts.splice(this.tpodepts.indexOf(ev.target.defaultValue),1);
      console.log("TPO Depts: "+this.tpodepts);
    }
 }
 selectyears(ev){
  if(ev.currentTarget.checked){
    this.tpoyears.push(ev.target.defaultValue);
    console.log("TPO Years: "+this.tpoyears);
    this.tpoyears=this.tpoyears;}
  else{
    var out=this.tpoyears.splice(this.tpoyears.indexOf(ev.target.defaultValue),1);
    console.log("TPO Years: "+this.tpoyears);
    this.tpodepts=this.tpodepts;
  }
}

onSearchClick(){
  let minaggrigt=this.minaggrigt;
  if(JSON.stringify(this.minaggrigt)==""||JSON.stringify(this.minaggrigt)==undefined)
  {
    this.flashmessage.show("Please Enter Minimum Aggrigate",{cssClass:'alert-danger text-center',timeOut:2000});
  }
  else
  {
    if(this.tpodepts.length==0&&this.tpoyears.length==0){
      this.tpoResult=[];
      this.tpotable=false;
      this.tpodepts=this.tpodepts;
      this.tpoyears=this.tpoyears;
      return;
    }
    this.searchService.tpoSearch(JSON.stringify(this.tpodepts),JSON.stringify(this.tpoyears),JSON.stringify(this.minaggrigt))
    .subscribe(data => {
      if(data.length==0){
        this.flashmessage.show("No recoreds found",{cssClass:'alert-danger text-center',timeOut:2000});
        this.tpotable=false;
        this.tpoResult=[];}
      else{
          this.tpoResult=data;
          this.tpotable=true;
          console.log(this.tpoResult);
      }
    })
}
}

deletestudent(student){
  console.log(student);
  var retVal = confirm("Are you sure to Delete?");
        if( retVal == true)
        {
          this.authService.deleteUser(student.userid).subscribe(data=>{
            if(data.success){
              this.flashmessage.show("student record deleted",{cssClass:'alert-success text-center',timeOut:2000});
              this.students.splice(this.students.indexOf(student),1)
            }
            else
            {
              console.log(data);
              this.flashmessage.show("Something went wrong.",{cssClass:'alert-danger text-center',timeOut:2000});
            }
          })
        }
        else
        {
        console.log ("Admin doesn't want to Delete!");
        //this.authService.toggleForm=!this.authService.toggleForm;
        this.router.navigate(['/search']);  
        }
}
updatestudent(student){
    this.authService.selectedUser=student;
    this.authService.toggleForm=!this.authService.toggleForm;
  }
senddata(student){
  this.authService.send_mail_to_phone(student).subscribe(res=>{
    if(res.success)
    {
      //this.flash.show(res.msg,{cssClass:'alert-success text-center',timeOut:2000});
      alert(res.msg);
    }
    else{
      //this.flash.show("Something went wrong.",{cssClass:'alert-alert text-center',timeOut:2000});
      alert(res.msg);
    }
  });
}
tableToExcel(table, name, filename) {
  let uri = 'data:application/vnd.ms-excel;base64,', 
  template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>', 
  base64 = function(s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) },         format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; })}
  
  if (!table.nodeType) table = document.getElementById(table)
  var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}

  var link = document.createElement('a');
  filename='Students_'+this.tpoyears+'_'+this.tpodepts+'_Above_'+this.minaggrigt+'%.xls';
  link.download = filename;
  link.href = uri + base64(format(template, ctx));
  link.click();
}
}
