import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderControlService } from './services/header-control.service';
import { FooterControlService } from './services/footer-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, public headerControlService: HeaderControlService, public footerControlService: FooterControlService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/order') {
          this.headerControlService.showHeader = false;
          this.footerControlService.showFooter = false;
        } else {
          this.headerControlService.showHeader = true;
          this.footerControlService.showFooter = true;
        }
      }
    });
  }

  ngOnInit(){}
 
}
