import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { CategoryService } from '../shared/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Category } from '../shared/category.model';
import { MenuItem } from 'primeng/api';
interface Categor {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  currentAction!: string;
  category: Category = new Category();
  pageTitle!: string

  categoryForm = this.fb.group({
    id: [0],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  })

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: NonNullableFormBuilder,
  ) { }
  ngOnInit(): void {
    this.setCurrentAction()
    this.items = [{ label: 'Categories', routerLink: '/categories' }, {label: 'Formulário de categoria'}];
    this.home = { icon: 'pi text-primary pi-home', routerLink: '/', styleClass: "color-blue" };

  }

  ngAfterContentChecked(): void {

  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }
  private loadCategory() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+!params.get("id")))
      ).subscribe({
        next: category => {
          this.category = category;
          this.categoryForm.patchValue(category)
        },
        error: error => alert("Ocorreu um erro no servidor, tente mais tarde")
      }
      )
    }
  }

  private setpageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = "Cadastro de Nova Categoria"
    } else {
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando Categoria:" + categoryName;
    }
  }
}
