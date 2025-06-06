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

interface Project {
  id: number;
  name: string;
  description: string;
  administrator: { name: string };
  created_at: string;
}

interface ProjectUser {
  id: number;
  name: string;
  email: string;
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
  ],
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  projectId!: number;
  project!: Project;
  dataSource = new MatTableDataSource<ProjectUser>([]);
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

    this.projectsService.getProjectById(this.projectId).subscribe({
      next: (res) => {
        this.project = res ?? {} as Project;
      },
      error: () => {
        this.snackBar.open('Error al cargar el proyecto', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/page/projects']);
      }
    });

    this.projectsService.getProjectById(this.projectId).subscribe({
      next: (res) => {
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
    this.snackBar.open('Funcionalidad de asignar usuario aún no implementada', 'Cerrar', { duration: 3000 });
  }
}
