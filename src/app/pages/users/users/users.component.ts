import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from 'app/services/users/users.service';
import { ModalCreateUserComponent } from 'app/pages/modal-create-user/modal-create-user.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalEditUsersComponent } from 'app/pages/modal-edit-users/modal-edit-users.component';
import { debounceTime, distinctUntilChanged, max } from 'rxjs';
import { duration } from 'moment';

export interface User {
  name: string;
}


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

// UsersComponent es una clase que representa el componente de gestión de usuarios
export class UsersComponent {
[x: string]: any;

  displayColumns: string[] = [
    'name',
    'email',
    'role',
    'action'
  ];

  //el breadcrumbs es una propiedad que contiene la información de la ruta de navegación
  breadscrumbs = [
    {
      title: 'Gestión de Usuarios',
      items: [],
      active: 'Datos básicos',
    },
  ];

  breadscrumsDetails = [
    {
      title: '',
    },
  ];
  
  // table
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  // search
  userFormSearchFilter!: FormGroup;
  usersList: any[] = [];
  
  isLoading = false;
  
  userDefaultFilterSearch: any = {
    name: undefined,
    email: undefined,
  };
  
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly userService: UsersService,
    private readonly dialogModel: MatDialog,
    private readonly _snackBar: MatSnackBar
  ) {}
  

  ngOnInit(): void {
    this.createUserFormSearchFilter();
    this.getAllUserByAdministrator();
    this.handleUserFilterChange('name', 'name');
    this.handleUserFilterChange('email', 'email');
  }

  // getAllUserByAdministrator es un método que obtiene todos los usuarios administrados por el administrador
  getAllUserByAdministrator(filters?: any): void {
    this.isLoading = true;
    this.userService.getAllUsersByAdministrator(filters).subscribe({
      next: (response: { users: any[]; }) => {
        this.usersList = response.users;
        this.dataSource.data = response.users;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // createUserFormSearchFilter es un método que crea el formulario de búsqueda de usuarios
  private createUserFormSearchFilter(): void {
    this.userFormSearchFilter = this._formBuilder.group({
      name: [''],
      email: ['']
    });
  }

  // getRoleName es un método que obtiene el nombre del rol del usuario
  getRoleName(rol_id: number): string {
    switch (rol_id) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuario';
      default:
        return 'Desconocido';
    }
  }

  // handleUserFilterChange es un método que maneja los cambios en los filtros de búsqueda de usuarios
  private handleUserFilterChange(controlName: string, filterKey: string) {
    this.userFormSearchFilter.controls[controlName].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value: any) => {
      this.userDefaultFilterSearch[filterKey] = value;
      console.log(this.userDefaultFilterSearch);
      this.getAllUserByAdministrator({ ...this.userDefaultFilterSearch, [filterKey]: value });
    });
  }

  // openModalCreateUser es un método que abre el modal para crear un nuevo usuario
  openModalCreateUser(): void {
    const dialogRef = this.dialogModel.open(ModalCreateUserComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserByAdministrator();
      }
    })
  }

  // openModalUpdateUsers es un método que abre el modal para editar un usuario existente
  openModalUpdateUsers(userInformation: any): void {
    const dialogRef = this.dialogModel.open(ModalEditUsersComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
      data: { user: userInformation }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserByAdministrator();
      }
    })
  }
  
  // deleteUser es un método que elimina un usuario
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: (response: { message: any; }) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.getAllUserByAdministrator();
      },
      error: (error: { error: { message: string; }; }) => {
        const errorMessage = error.error?.message || 'Error al eliminar el usuario';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000});
      }
    });
  }
}
