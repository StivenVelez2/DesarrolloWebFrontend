import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent,
  MatDialogModule, MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from 'app/services/projects/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-create-project',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatSelectModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatDialogActions,
    MatDialogClose, MatDialogTitle, MatDialogContent, ReactiveFormsModule
  ],
  templateUrl: './modal-create-project.component.html',
  styleUrls: ['./modal-create-project.component.scss']
})
export class ModalCreateProjectComponent implements OnInit {

  formCreateProject!: FormGroup;
  administratorsValue: any[] = [];
  showFieldAdministrator: boolean = false;
  isEditMode: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _projectService: ProjectsService,
    private readonly _dialogRef: MatDialogRef<ModalCreateProjectComponent>,
    private readonly _snackBar: MatSnackBar,
  ) {
    this.createFormProject();
  }

  ngOnInit(): void {
    this.getAllAdministrators();

    if (this.data?.project) {
      this.isEditMode = true;
      const project = this.data.project;

      this.formCreateProject.patchValue({
        nombre: project.nombre,
        descripcion: project.descripcion,
        rol_id: project.rol_id,
        administrador_id: project.administrador_id
      });

      if (project.rol_id !== 1) {
        this.showAdministratorField();
      } else {
        this.hideAdministratorField();
      }
    }
  }

  createFormProject(): void {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      rol_id: ['', Validators.required],
      administrador_id: [undefined]
    });
  }

  getAllAdministrators(): void {
    this._projectService.getAllAdministrators().subscribe({
      next: (res) => {
        this.administratorsValue = res.administrators;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onChangeRole(event: any): void {
    if (event.value === '1') {
      this.hideAdministratorField();
    } else {
      this.showAdministratorField();
    }
  }

  onSubmit(): void {
    if (this.formCreateProject.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    const projectData = {
      nombre: this.formCreateProject.get('nombre')?.value,
      descripcion: this.formCreateProject.get('descripcion')?.value,
      rol_id: Number(this.formCreateProject.get('rol_id')?.value),
      administrador_id: this.formCreateProject.get('administrador_id')?.value
    };

    if (this.isEditMode) {
      this._projectService.updateProject(this.data.project.id, projectData).subscribe({
        next: (response) => {
          this._snackBar.open(response.message || 'Proyecto actualizado exitosamente', 'Cerrar', { duration: 5000 });
          this._dialogRef.close(true);
        },
        error: (error) => {
          const errorMessage = error.error?.result || 'Ocurrió un error al actualizar el proyecto.';
          this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this._projectService.createProject(projectData).subscribe({
        next: (response) => {
          this._snackBar.open(response.message || 'Proyecto creado exitosamente', 'Cerrar', { duration: 5000 });
          this.formCreateProject.reset();
          this._dialogRef.close(true);
        },
        error: (error) => {
          const errorMessage = error.error?.result || 'Ocurrió un error al crear el proyecto.';
          this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  private showAdministratorField(): void {
    this.showFieldAdministrator = true;
    this.formCreateProject.get('administrador_id')?.setValidators([Validators.required]);
    this.formCreateProject.get('administrador_id')?.updateValueAndValidity();
  }

  private hideAdministratorField(): void {
    this.showFieldAdministrator = false;
    this.formCreateProject.get('administrador_id')?.clearValidators();
    this.formCreateProject.get('administrador_id')?.setValue(undefined);
    this.formCreateProject.get('administrador_id')?.updateValueAndValidity();
  }
}
