import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'app/services/projects/projects.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { ModalAssignUsersProjectsComponent } from '../modal-assign-users-projects/modal-assign-users-projects.component';
import { ModalViewProjectComponent } from '../modal-view-project/modal-view-project.component';

// Interfaces corregidas para coincidir con los nombres usados en HTML
interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  administrador: {
    nombre: string;
    apellido: string;
  };
  created_at: string;
}

interface ProjectUser {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  templateUrl: './projects-detail.component.html',
  styleUrls: ['./projects-detail.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
    MatCard,
  ],
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  projectId!: number;
  project!: Project;
  dataSource = new MatTableDataSource<ProjectUser>([]);
  displayedColumns: string[] = ['nombre', 'correo', 'acciones'];
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

    if (isNaN(this.projectId)) {
      this.snackBar.open('ID de proyecto inválido', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/page/projects']);
      return;
    }

    this.loadProjectDetails();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadProjectDetails(): void {
    this.isLoading = true;

    // Obtener detalles del proyecto
    this.projectsService.getProjectById(this.projectId).subscribe({
      next: (res: Project) => {
        this.project = res;
      },
      error: () => {
        this.snackBar.open('Error al cargar el proyecto', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/page/projects']);
      }
    });

    // Obtener usuarios asignados
    this.projectsService.getProjectById(this.projectId).subscribe({
      next: (res: ProjectUser[]) => {
        this.dataSource.data = res;
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
    const dialogRef = this.dialog.open(ModalAssignUsersProjectsComponent, {
      width: '600px',
      data: { projectId: this.projectId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.loadProjectDetails();
      }
    });
  }

  openViewProjectModal(): void {
    this.dialog.open(ModalViewProjectComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { project: this.project }, // ✅ corregido
      disableClose: true,
      autoFocus: false
    });
  }



  closeModal(): void {
    this.router.navigate(['/page/projects']);
  }
}
