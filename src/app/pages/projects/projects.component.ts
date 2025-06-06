  import { Component, OnInit, ViewChild } from '@angular/core';
  import { FormBuilder, FormGroup } from '@angular/forms';
  import { MatDialog } from '@angular/material/dialog';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { MatPaginator } from '@angular/material/paginator';
  import { MatTableDataSource } from '@angular/material/table';
  import { ProjectsService } from 'app/services/projects/projects.service';
  import { ModalCreateProjectComponent } from  'app/pages/modal-create-project/modal-create-project.component';
  import { ModalViewProjectComponent } from 'app/pages/modal-view-project/modal-view-project.component';
  import { ModalEditProjectsComponent } from '../modal-edit-projects/modal-edit-projects.component';
  import Swal from 'sweetalert2';
  import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
  import { CommonModule } from '@angular/common';
  import { ReactiveFormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { MatTableModule } from '@angular/material/table';
  import { MatPaginatorModule } from '@angular/material/paginator';
  import { MatIconModule } from '@angular/material/icon';
  import { MatOptionModule } from '@angular/material/core';
  import { MatDatepickerModule } from '@angular/material/datepicker';
  import { MatSelectModule } from '@angular/material/select';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatAutocompleteModule } from '@angular/material/autocomplete';
  import { MatButtonModule } from '@angular/material/button';
  import { UsersService } from 'app/services/users/users.service';



  @Component({
    standalone: true,
    imports: [
      BreadcrumbComponent,
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatTableModule,
      MatPaginatorModule,
      MatIconModule,
      CommonModule,
      BreadcrumbComponent,
      MatFormFieldModule,
      MatSelectModule,
      MatOptionModule,
      MatDatepickerModule,
      MatInputModule,
      MatTooltipModule,
      ReactiveFormsModule,
      MatAutocompleteModule,
      MatIconModule,
      MatPaginatorModule,
      MatTableModule,
      MatProgressSpinnerModule,
      MatButtonModule

    ],
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
  })
  export class ProjectsComponent implements OnInit {

    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    displayColumns: string[] = ['nombre', 'descripcion', 'fecha_creacion', 'total_usuarios', 'administrador', 'action'];
    projectFormSearchFilter!: FormGroup;
    isLoading = false;

    breadscrumbs = [
      {
        title: 'Gestión de proyectos',
        items: ['Administración', 'Proyectos'],
        active: 'Lista de proyectos'
      }
    ];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
      private readonly _formBuilder: FormBuilder,
      private readonly _projectService: ProjectsService,
      private readonly _dialog: MatDialog,
      private readonly _snackBar: MatSnackBar
    ) {
      this.projectFormSearchFilter = this._formBuilder.group({
        name: ['']
      });
    }

    ngOnInit(): void {
      this.getProjects();

      // Escuchar cambios en el filtro de nombre
      this.projectFormSearchFilter.get('name')?.valueChanges.subscribe(value => {
        this.dataSource.filter = value.trim().toLowerCase();
      });

      this.dataSource.filterPredicate = (data, filter) => {
        return data.nombre.toLowerCase().includes(filter);
      };
    }
    getProjects(): void {
      this.isLoading = true;
      this._projectService.getAllProject().subscribe({
        next: (res) => {
          this.isLoading = false;
          const projects = res.projects.map((project: any) => ({
            ...project,
            total_usuarios: project.usuarios.length > 0 ? project.usuarios.length : 0
          }));
          this.dataSource.data = projects;
          this.dataSource.paginator = this.paginator;
        },
        error: () => {
          this.isLoading = false;
          this._snackBar.open('Error al cargar los proyectos', 'Cerrar', { duration: 3000 });
        }
      });
    }

    openModalCreateProject(): void {
      const dialogRef = this._dialog.open(ModalCreateProjectComponent, {
        width: '600px',
        data: {},
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getProjects();
        }
      });
    }
    openModalEditProject(project: any): void {
    const dialogRef = this._dialog.open(ModalEditProjectsComponent, {
      width: '600px',
      data: { project } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProjects();
      }
    });
  }


    openModalViewProject(project: any): void {
      this._dialog.open(ModalViewProjectComponent, {
        data: {
          project: project,
          projectUsers: this.dataSource.data
        },
        width: '700px'
    });
    }

    deleteProject(projectId: number): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el proyecto permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this._projectService.deleteProject(projectId).subscribe({
            next: (res) => {
              this._snackBar.open(res.message || 'Proyecto eliminado exitosamente', 'Cerrar', { duration: 3000 });
              this.getProjects();
            },
            error: () => {
              this._snackBar.open('Error al eliminar el proyecto', 'Cerrar', { duration: 3000 });
            }
          });
        }
      });
    }
  }
