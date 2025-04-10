¡Perfecto! Acá tenés un `README.md` inicial listo para copiar y pegar en la raíz del proyecto:

---

# Grayola Projects App

Aplicación web para la gestión de proyectos de diseño, construida como parte del proceso técnico para **Grayola**.

## 🛠 Stack técnico

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (Autenticación + PostgreSQL)
- **UI (bonus)**: [ShadCN UI](https://ui.shadcn.com/) (opcional, si suma visualmente)

## 🚀 Funcionalidades clave

- Autenticación por rol con Supabase
- CRUD de proyectos con subida de archivos
- Interfaz limpia, intuitiva y responsiva
- Protección de rutas y funciones según el rol del usuario
- Validación de formularios

## 🧪 Ejecutar localmente

1. Clonar el repo

```bash
git clone https://github.com/lautaroayosa/grayola-projects-app.git
cd grayola-projects-app
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar Supabase

Crear un archivo `.env.local` con las claves de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

4. Ejecutar el proyecto

```bash
npm run dev
```

---

## 📄 Licencia

Este proyecto fue desarrollado exclusivamente como parte de un proceso de selección para Grayola.  
**No está autorizado su uso parcial o total en ambientes comerciales sin el consentimiento del autor.**

> License: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)

---

## ✨ Autor

**Lautaro Ayosa**  
[https://github.com/lautaroayosa](https://github.com/lautaroayosa)
