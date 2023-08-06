import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  categories: Category[] = []

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Categories' }];
    this.home = { icon: 'pi text-primary pi-home', routerLink: '/', styleClass: "color-blue" };
    this.categoryService.getAll().subscribe({
      next: categories => this.categories = categories,
      error: error => alert('Erro ao carregar a lista'),
    })
  }

  deleteCategory(category: any) {
    const mustDelete = confirm("Deseja realmente excluir este item?");
    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe({
        next: () =>
          this.categories = this.categories.filter(element => element != category),
        error: error => alert('Erro ao tentar excluir!'),
      })
    }
  }
}
