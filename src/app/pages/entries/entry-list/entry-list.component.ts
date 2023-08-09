import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  entries: Entry[] = []

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Lançamentos' }];
    this.home = { icon: 'pi text-primary pi-home', routerLink: '/', styleClass: "color-blue" };
    this.entryService.getAll().subscribe({
      next: entries => this.entries = entries,
      error: error => alert('Erro ao carregar a lista'),
    })
  }

  deleteEntry(entry: any) {
    const mustDelete = confirm("Deseja realmente excluir este item?");
    if (mustDelete) {
      this.entryService.delete(entry.id).subscribe({
        next: () =>
          this.entries = this.entries.filter(element => element != entry),
        error: error => alert('Erro ao tentar excluir!'),
      })
    }
  }
}
