import { Component, CUSTOM_ELEMENTS_SCHEMA, HostBinding, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BookingComponent } from '../booking/booking.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatRippleModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    BookingComponent,
    RouterModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class NavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    title = 'evurboweb';
    constructor(private overlay:OverlayContainer){
  
    }
    toggleControl = new FormControl(false);
    @HostBinding('class') className = '';
    darkClassName = 'theme-dark';
    lightClassName = 'theme-light';
    isDarkTheme:boolean = true;;
    toggleTheme() {
      this.toggleControl.setValue(!this.toggleControl.value);
    }
  
  ngOnInit(): void {
  
    this.toggleControl.valueChanges.subscribe(
      (darkMode:any)=>{
        this.className= darkMode ? this.darkClassName : this.lightClassName;
        if(darkMode){
          this.overlay.getContainerElement().classList.add(this.darkClassName);
  
        }else{
          this.overlay.getContainerElement().classList.remove(this.darkClassName);
        }
  
      }
    )
   
  
  
    }
}
