import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectsService } from 'app/services/projects/projects.service';
import { ModalCreateProjectComponent } from  'app/pages/modal-create-project/modal-create-project.component';
import { ModalViewProjectComponent } from 'app/pages/modal-create-project/modal-create-project.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayColumns: string[] = ['nombre', 'descripcion', 'fechaCreacion', 'totalUsuarios', 'administrador', 'action'];
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
    this._projectService.getAllProjects().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.projects || []);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this._snackBar.open('Error al obtener los proyectos', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
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

  openModalUpdateProject(project: any): void {
    const dialogRef = this._dialog.open(ModalCreateProjectComponent, {
      width: '600px',
      data: {
        ...project,
        id: project.id,
        isEditMode: true
      }
    });

    dialogRef.componentInstance.isEditMode = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProjects();
      }
    });
  }

  openModalViewProject(project: any): void {
    this._dialog.open(ModalViewProjectComponent, {
      width: '600px',
      data: project
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
