import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from 'app/services/users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ProjectsService } from '../../services/projects/projects.service';

@Component({
  selector: 'app-modal-assign-users-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatSpinner,
  ],
  templateUrl: './modal-assign-users-projects.component.html',
  styleUrls: ['./modal-assign-users-projects.component.scss']
})
export class ModalAssignUsersProjectsComponent implements OnInit {
  assignForm!: FormGroup;
  users: any[] = [];
  isLoading = false;
  isAssigning = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ModalAssignUsersProjectsComponent>,
    private readonly _userService: UsersService,
    private readonly _snackBar: MatSnackBar,
    private readonly _ProjectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.createAssignForm();
    this.loadUsers();
  }

  createAssignForm(): void {
    this.assignForm = this.fb.group({
      user_id: ['', Validators.required]
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this._userService.getAllUsersByAdministrator().subscribe({
      next: (res) => {
        this.users = res.users || res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al obtener usuarios', err);
        this._snackBar.open('No se pudieron cargar los usuarios', 'Cerrar', { duration: 5000 });
      }
    });
  }

  assignUser(): void {
    if (this.assignForm.invalid || this.isAssigning) return;

    this.isAssigning = true;
    const IdUsuario = this.assignForm.value.user_id;
    const IdProyecto = this.data.projectId;

    this._ProjectsService.assignUserToProject(IdProyecto, IdUsuario)
      .subscribe({
        next: () => {
          this._snackBar.open('Usuario asignado correctamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isAssigning = false;
          let msg = 'No se pudo asignar el usuario';
          if (err?.error?.message) msg = err.error.message;
          this._snackBar.open(msg, 'Cerrar', { duration: 5000 });
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}