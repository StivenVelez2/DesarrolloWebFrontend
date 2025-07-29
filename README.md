# Admin Access Project - Frontend

Este proyecto es un frontend desarrollado en **Angular 18** que forma parte de un sistema de administración de usuarios y proyectos. Utiliza Angular Material, Bootstrap, y varias bibliotecas avanzadas para ofrecer una experiencia rica e interactiva.

## 🚀 Características principales

- Gestión de usuarios y proyectos.
- Modales para crear, editar y visualizar usuarios y proyectos.
- Asignación de usuarios a proyectos.
- Panel de control con gráficos y estadísticas.
- Integración con servicios de autenticación.
- Temas SCSS personalizados.

## 🛠️ Tecnologías usadas

- **Angular 18**
- **Angular Material**
- **Bootstrap 5**
- **Ngx-Charts**, **ApexCharts**, **ECharts**
- **ngx-translate** (soporte multi-idioma)
- **ngx-datatable**
- **SweetAlert2**
- **Moment.js**, **XLSX**, **PDF Viewer**
- **RxJS**, **ngx-mask**, **ngx-scrollbar**

## 📦 Instalación

```bash
git clone https://github.com/StivenVelez2/DesarrolloWebFrontend.git
cd DesarrolloWebFrontend
npm install
```

## ▶️ Ejecución del proyecto

```bash
ng serve
```

El proyecto se ejecutará por defecto en `http://localhost:4200/`.

## ⚙️ Comandos útiles

```bash
npm run build      # Compilar para producción
npm run test       # Ejecutar pruebas
npm run lint       # Ejecutar linter
```

## 📁 Estructura principal

```
src/
├── app/
│   ├── pages/
│   │   ├── modal-assign-users-projects/
│   │   ├── modal-create-project/
│   │   ├── modal-create-user/
│   │   ├── modal-edit-projects/
│   │   ├── modal-edit-users/
│   │   ├── modal-view-project/
│   │   ├── projects/
│   │   ├── projects-detail/
│   │   ├── users/
│   │   └── pages.routes.ts
│   ├── services/
│   │   ├── alert/
│   │   ├── projects/
│   │   └── users/
│   └── ...
├── assets/
├── environments/
├── index.html
├── main.ts
├── styles.scss
```

## 🔗 Backend

Este frontend puede integrarse con una API RESTful. La configuración de entornos (`environment.ts`) permite definir distintas URLs para producción, desarrollo y pruebas.


## ✍️ Autor

**Johan Stiven Velez Gomez**  
Tecnólogo en Desarrollo de Software

