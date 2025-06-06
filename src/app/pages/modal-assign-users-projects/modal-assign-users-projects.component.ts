import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { UsersService } from 'app/services/users/users.service';
import { ProjectsService } from '../../services/projects/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-modal-assign-users-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatCardModule
  ],
  templateUrl: './modal-assign-users-projects.component.html',
  styleUrls: ['./modal-assign-users-projects.component.scss']
})
export class ModalAssignUsersProjectsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'nombre', 'correo'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isLoading = false;
  isAssigning = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
    private dialogRef: MatDialogRef<ModalAssignUsersProjectsComponent>,
    private _userService: UsersService,
    private _snackBar: MatSnackBar,
    private _ProjectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this._userService.getAllUsersByAdministrator().subscribe({
      next: (res) => {
        this.dataSource.data = res.users || res;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this._snackBar.open('No se pudieron cargar los usuarios', 'Cerrar', { duration: 5000 });
      }
    });
  }

  toggleAllRows(event: any) {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
    } else {
      this.selection.clear();
    }
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  assignSelectedUsers(): void {
    if (this.selection.isEmpty() || this.isAssigning) return;
    this.isAssigning = true;
    const requests = this.selection.selected.map(user =>
      this._ProjectsService.assignUserToProject(this.data.projectId, user.id)
    );
    Promise.all(requests.map(req => req.toPromise()))
      .then(() => {
        this._snackBar.open('Usuarios asignados correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      })
      .catch(() => {
        this._snackBar.open('Error al asignar usuarios', 'Cerrar', { duration: 5000 });
      })
      .finally(() => {
        this.isAssigning = false;
      });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}