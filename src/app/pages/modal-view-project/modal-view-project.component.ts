import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
export class ModalViewProjectComponent implements OnInit {
  project: any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['nombre', 'correo', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalViewProjectComponent>,
    private dialog: MatDialog,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.project = this.data.project;
    this.loadUsers();
  }

  loadUsers(): void {
    this.projectsService.getProjectById(this.project.id).subscribe({
      next: (res) => {
        this.dataSource.data = res.project.usuarios || res.project.users || []; // <-- Aquí
        this.dataSource.paginator = this.paginator;
      }
    });
  }


  openAssignUserModal(): void {
    this.dialog.open(ModalAssignUsersProjectsComponent, {
      width: '400px',
      data: { projectId: this.project.id }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Recarga los usuarios asignados si se asignó uno nuevo
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  removeUser(user: any): void {
    this.projectsService.removeUserFromProject(this.project.id, user.id).subscribe({
      next: () => {
        this.loadUsers();
      }
    });
  }
}