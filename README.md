# Grayola Projects App

Aplicación web construida para el technical assessment de Grayola. Permite gestionar proyectos de diseño de forma intuitiva y segura, adaptada a distintos roles de usuario: Clientes, Project Managers y Diseñadores.

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **UI**: Tailwind CSS + ShadCN UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **Auth & RBAC**: Supabase + middleware + policies
- **Deploy**: Vercel

## ✅ Features Implementadas

### 1. Autenticación y Roles
- Login/registro vía Supabase Auth.
- Control de acceso según rol:
  - **Cliente**: puede crear proyectos.
  - **Project Manager**: CRUD total de todos los proyectos.
  - **Diseñador**: acceso solo a proyectos asignados (modo lectura).

### 2. Gestión de Proyectos
- Crear, editar, eliminar y visualizar proyectos.
- Subida de uno o varios archivos (con soporte de almacenamiento en Supabase).
- Visualización de archivos adjuntos.

### 3. UI & UX
- Interfaz moderna y responsiva.
- Formularios accesibles y validados.
- Dashboard claro y segmentado por tipo de usuario.

### 4. Seguridad
- Middleware de protección de rutas por rol.
- Validaciones tanto en frontend como backend.
- Prevención de acceso indebido a funciones o datos.

## 🧪 Cómo ejecutar el proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/grayola-projects-app.git
cd grayola-projects-app
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura las variables de entorno
Crea un archivo .env.local y completalo con tus credenciales de Supabase:

``` env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
```

### 4. Corre la app en local
``` bash
npm run dev
```

Abrí `http://localhost:3000` en tu navegador.

## 🧠 Notas técnicas
Se usaron políticas de Row Level Security (RLS) para proteger datos en Supabase.

Se implementó separación de lógica de frontend/backend, manejo de uploads, y validación de roles tanto en cliente como en servidor.

El sistema de archivos permite subida y eliminación individual por archivo, útil para proyectos en curso.

El layout y estructura fueron pensados para escalar fácilmente en un equipo real.

## 🌐 Deploy
Aplicación desplegada en Vercel: grayola-projects-app.vercel.app

## 📁 Estructura del proyecto
```csharp
/
├── app/                      # Rutas y páginas (Next.js App Router)
├── components/               # Componentes UI reutilizables
├── lib/                      # Supabase client, helpers & typescript Types
├── public/                   # Archivos estáticos
```

## 🤝 Autor
Proyecto desarrollado por [Lautaro Ayosa](https://github.com/lautaroayosa) como parte del proceso de selección para Grayola.

