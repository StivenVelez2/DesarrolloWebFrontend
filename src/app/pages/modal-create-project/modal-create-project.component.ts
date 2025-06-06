import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatDialogRef, MatDialogModule
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from 'app/services/projects/projects.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-create-project',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatIconModule
  ],
  templateUrl: './modal-create-project.component.html',
  styleUrls: ['./modal-create-project.component.scss']
})
export class ModalCreateProjectComponent implements OnInit {
  formCreateProject!: FormGroup;
  isEditMode: boolean = false;
  showFieldAdministrator: boolean = false;
  administratorsValue: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _dialogRef: MatDialogRef<ModalCreateProjectComponent>,
    private readonly _formBuilder: FormBuilder,
    private readonly _projectService: ProjectsService,
    private readonly _snackBar: MatSnackBar
  ) {
    this.createFormProjects();
  }

  ngOnInit(): void {
    this.getAllAdministrators();

    if (this.data?.isEditMode) {
      this.isEditMode = true;
      this.loadProjectData(this.data);
    }
  }

  createFormProjects(): void {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      administrador_id: [undefined]
    });
  }

  loadProjectData(data: any): void {
    this.formCreateProject.patchValue({
      nombre: data.nombre,
      descripcion: data.descripcion,
      administrador_id: data.administrador_id
    });

    if (data.rol_id !== 1) {
      this.showAdministratorField();
    } else {
      this.hideAdministratorField();
    }
  }

  getAllAdministrators(): void {
    this._projectService.getAllAdministrators().subscribe({
      next: (res) => {
        this.administratorsValue = res.users || [];
      },
      error: () => {
        this._snackBar.open('Error al cargar los administradores', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onChangeRole(event: any): void {
    const selectedRole = Number(event.value);
    if (selectedRole === 1) {
      this.hideAdministratorField();
    } else {
      this.showAdministratorField();
    }
  }

  private showAdministratorField(): void {
    this.showFieldAdministrator = true;
    const adminControl = this.formCreateProject.get('administrador_id');
    adminControl?.setValidators(Validators.required);
    adminControl?.updateValueAndValidity();
  }

  private hideAdministratorField(): void {
    this.showFieldAdministrator = false;
    const adminControl = this.formCreateProject.get('administrador_id');
    adminControl?.clearValidators();
    adminControl?.setValue(undefined);
    adminControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.formCreateProject.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    const projectData = {
      nombre: this.formCreateProject.value.nombre,
      descripcion: this.formCreateProject.value.descripcion,
      administrador_id: this.formCreateProject.value.administrador_id
    };

    if (this.isEditMode) {
      this._projectService.updateProject(this.data.id, projectData).subscribe({
        next: (res) => {
          this._snackBar.open(res.message || 'Proyecto actualizado correctamente.', 'Cerrar', { duration: 3000 });
          this._dialogRef.close(true);
        },
        error: () => {
          this._snackBar.open('Error al actualizar el proyecto.', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this._projectService.createProject(projectData).subscribe({
        next: (res) => {
          this._snackBar.open(res.message || 'Proyecto creado correctamente.', 'Cerrar', { duration: 3000 });
          this._dialogRef.close(true);
        },
        error: () => {
          this._snackBar.open('Error al crear el proyecto.', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
