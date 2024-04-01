import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AirChartComponent } from './components/air-chart/air-chart.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetComponent } from './components/reset/reset.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AddressListComponent } from './components/address-list/address-list.component';

const routes: Routes = [
  { path: 'charts', component: AirChartComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'address', component: AddressListComponent },
  { path: 'stats', component: StatisticsComponent },
  { path: '', redirectTo: 'charts', pathMatch: 'full' },
  { path: '**', redirectTo: 'charts', pathMatch: 'full' }

]

@NgModule({
  declarations: [
    AppComponent,
    AirChartComponent,
    ResetComponent,
    StatisticsComponent,
    AddressListComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    RouterModule,
    BrowserModule,
    CanvasJSAngularChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
