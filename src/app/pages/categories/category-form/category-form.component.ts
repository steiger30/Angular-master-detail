import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { CategoryService } from '../shared/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Category } from '../shared/category.model';
import { MenuItem, Message, MessageService } from 'primeng/api';

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
  serverErrorMessages!: string[]
  submittingForm: boolean = false
  pageTitle!: string
  messages: Message[] = [{ severity: 'success', summary: 'Success', detail: 'Message Content' }];
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
    private messageService: MessageService

  ) { }
  ngOnInit(): void {
    this.setCurrentAction()
    this.loadCategory()
    this.items = [{ label: 'Categoria', routerLink: '/categories' }, { label: this.currentAction === "new"? "Cadastro": "Editar"}];
    this.home = { icon: 'pi text-primary pi-home', routerLink: '/', styleClass: "color-blue" };

  }

  ngAfterContentChecked(): void {
    this.setpageTitle()

  }

  submitForm() {
    this.submittingForm = true
    if (this.currentAction == "new") {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  // PRIVATE METHODS
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
        switchMap(params => this.categoryService.getById(+params.get("id")!))
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

      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe({
      next: category => this.actionsForSucess(category),
      error: error => this.actionsForError(error)
    })
  }
  private updateCategory() {

  }
  private actionsForSucess(category: Category) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação processada com sucesso!' });

    //redirect
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }
  private actionsForError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocorreu um erro ao processar a sua solicitação!', closable: false });
    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).erros;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, teste mais tarde."]

  }
}
// severity?: string;
//     summary?: string;
//     detail?: string;
//     id?: any;
//     key?: string;
//     life?: number;
//     sticky?: boolean;
//     closable?: boolean;
//     data?: any;
//     icon?: string;
//     contentStyleClass?: string;
//     styleClass?: string;
//     closeIcon?: string;
