//este modal es para editar un usuario existente en la aplicacion, contiene el formulario y la logica para enviar los datos al servidor
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectsService } from 'app/services/projects/projects.service';

@Component({
  selector: 'app-modal-edit-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-edit-projects.component.html',
  styleUrls: ['./modal-edit-projects.component.scss']
})
export class ModalEditProjectsComponent {
  formUpdateProjects!: FormGroup;
  administratorsValues: any[] = [];
  
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private readonly _formBuilder: FormBuilder,
      private readonly _snackBar: MatSnackBar,
      private readonly _projectsService: ProjectsService,
      private readonly dialogRef: MatDialogRef<ModalEditProjectsComponent>
    ) {
      // Inicializa el formulario de edición de usuario
      this.updateFormProjects();
      this.getAllAdministrator();
    }
  
    //sirve para inicializar el formulario de edición de usuario
    ngOnInit() {
      if (this.data?.project) {
        this.loadProjectData(this.data.project);
      }
    }
  
    // createFormUsers es un método que crea el formulario de creación de usuario
    updateFormProjects() {
      this.formUpdateProjects = this._formBuilder.group({
        nombre: ['', Validators.required],
        descripcion: [''], 
        administrador_id: ['', Validators.required]
      });
    }

  
    // Este método se utiliza para cargar los datos del usuario en el formulario de edición
    loadProjectData(project: any) {
      this.formUpdateProjects.patchValue({
        nombre: project.nombre,
        descripcion: project.descripcion,
        administrador_id: project.administrador_id
    });
  }
  
    // getAllAdministrator es un método que obtiene todos los administradores del sistema
    getAllAdministrator() {
      this._projectsService.getAllAdministrators().subscribe({
        next: (res) => {
          this.administratorsValues = res.users;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  
    // updateUsers es un método que se ejecuta cuando se envía el formulario de edición de usuario
    // Este método envía los datos del formulario al servidor para actualizar el usuario
    updateProject() {
      if (this.formUpdateProjects.valid) {
        const projectData = this.formUpdateProjects.value;
        const projectId = this.data?.project?.id;
  
        this._projectsService.updateProject(projectId, projectData).subscribe({
          next: (response) => {
            this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
            this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
          }
        });
      }
    }
}
