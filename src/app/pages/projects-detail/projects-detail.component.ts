import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'app/services/projects/projects.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-detail',
  templateUrl: './projects-detail.component.html',
  styleUrls: ['./projects-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  projectId!: number;
  project: any;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'email', 'action'];
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProjectDetails();
  }

  loadProjectDetails(): void {
    this.isLoading = true;

    this.projectsService.getProjectById(this.projectId).subscribe({
      next: (res) => {
        this.project = res;
      },
      error: () => {
        this.snackBar.open('Error al cargar el proyecto', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/page/projects']);
      }
    });

    this.projectsService.getUsersByProject(this.projectId).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar los usuarios del proyecto', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  deleteUserAssignment(userId: number): void {
    if (!confirm('¿Estás seguro de eliminar este usuario del proyecto?')) return;

    this.projectsService.removeUserFromProject(this.projectId, userId).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado del proyecto', 'Cerrar', { duration: 3000 });
        this.loadProjectDetails();
      },
      error: () => {
        this.snackBar.open('No se pudo eliminar el usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openAssignUserDialog(): void {
    // Aquí puedes usar un diálogo si lo tienes implementado
    // Ejemplo: this.dialog.open(AssignUserDialogComponent, { data: { projectId: this.projectId } });
    this.snackBar.open('Funcionalidad de asignar usuario aún no implementada', 'Cerrar', { duration: 3000 });
  }
}
