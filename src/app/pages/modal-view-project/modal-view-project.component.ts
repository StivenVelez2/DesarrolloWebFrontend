import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ModalAssignUsersProjectsComponent } from '../modal-assign-users-projects/modal-assign-users-projects.component';
import { ProjectsService } from 'app/services/projects/projects.service';

@Component({
  selector: 'app-modal-view-project',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './modal-view-project.component.html',
  styleUrls: ['./modal-view-project.component.scss']
})
export class ModalViewProjectComponent implements OnInit, AfterViewInit {
  project: any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['nombre', 'correo', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: any },
    private dialogRef: MatDialogRef<ModalViewProjectComponent>,
    private dialog: MatDialog,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.project = this.data.project;
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers(): void {
    this.projectsService.getProjectById(this.project.id).subscribe({
      next: (res) => {
        const users = res.project.usuarios || res.project.users || [];
        this.dataSource.data = users;
      }
    });
  }

  openViewProjectModal(): void {
    this.dialog.open(ModalViewProjectComponent, {
      width: '900px', // o '95vw' para casi toda la pantalla
      maxWidth: '95vw',
      data: { project: this.project },
      disableClose: true,
      autoFocus: false
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  removeUser(userId: number): void {
    if (!this.project) return;
    this.projectsService.removeUserFromProject(this.project.id, userId).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter((user: any) => user.id !== userId);
      }
    });
  }
}
