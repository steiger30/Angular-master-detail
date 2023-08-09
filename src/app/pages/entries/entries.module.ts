import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntriesRoutingModule } from './entries-routing.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { EntryService } from './shared/entry.service';
import { EntryListComponent } from './entry-list/entry-list.component';


@NgModule({
  declarations: [
    EntryFormComponent,
    EntryListComponent
  ],
  imports: [
    CommonModule,
    EntriesRoutingModule,
    BreadcrumbModule,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule
  ], providers: [EntryService, MessageService]
})
export class EntriesModule { }
