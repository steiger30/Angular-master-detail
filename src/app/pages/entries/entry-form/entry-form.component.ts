import { AfterContentChecked, Component, OnInit } from '@angular/core';
import {  Validators, NonNullableFormBuilder } from '@angular/forms';
import { EntryService } from '../shared/entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Entry } from '../shared/entry.model';
import { MenuItem, Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  currentAction!: string;
  entry: Entry = new Entry();
  serverErrorMessages!: string[]
  submittingForm: boolean = false
  pageTitle!: string
  messages: Message[] = [{ severity: 'success', summary: 'Success', detail: 'Message Content' }];

  entryForm = this.fb.group({
    id: [0],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    amount: [''],
    date: [''],
    paid: [true],
    categoryId: [0],

  })

  constructor(
    private categoryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private messageService: MessageService

  ) { }
  ngOnInit(): void {
    this.setCurrentAction()
    this.loadEntry()
    this.items = [{ label: 'Categoria', routerLink: '/entries' }, { label: this.currentAction === "new" ? "Cadastro" : "Editar" }];
    this.home = { icon: 'pi text-primary pi-home', routerLink: '/', styleClass: "color-blue" };

  }

  ngAfterContentChecked(): void {
    this.setpageTitle()

  }

  submitForm() {
    this.submittingForm = true
    if (this.currentAction == "new") {
      this.createEntry();
    } else {
      this.updateEntry();
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
  private loadEntry() {
    if (this.currentAction == "edit") {

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")!))
      ).subscribe({
        next: entry => {
          this.entry = entry;
          this.entryForm.patchValue(entry)
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
      const categoryName = this.entry.name || ""

      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.categoryService.create(entry).subscribe({
      next: entry => this.actionsForSucess(entry),
      error: error => { this.actionsForError(error) }
    })
  }
  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.categoryService.update(entry).subscribe({
      next: entry => this.actionsForSucess(entry),
      error: error => { this.actionsForError(error) }
    })
  }
  private async actionsForSucess(entry: Entry) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação processada com sucesso!' });

    //redirect
    setTimeout(() => {
      this.router.navigateByUrl("entries", { skipLocationChange: true }).then(
        () => this.router.navigate(["entries", entry.id, "edit"])
      )
    }, 2000);
  }
  private actionsForError(error: any) {
    console.log("oi")
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocorreu um erro ao processar a sua solicitação!', closable: false });
    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).erros;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]

  }
}
