import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  ngOnInit(): void {
    this.items = [{ label: 'Categories' }];
    this.home = { icon: 'pi text-primary pi-home', routerLink: '/', styleClass: "color-blue" };
  }

  deleteCategory(categoriaId: any){
    alert('excluir')
  }
}
