import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
year = "2018-2022";
copyright = "M.G.R.A.V UNIVERSITY";
  constructor() { }

  ngOnInit() {
  }

}
