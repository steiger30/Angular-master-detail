import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import { CategoriesModule } from './pages/categories/categories.module';
import { InMemoryDatabase } from './in-memory-database';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    BrowserAnimationsModule,
    MenubarModule,
    NgbModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
