# Expedientes Pedagógicos

Aplicación web en español para gestionar expedientes pedagógicos individuales de estudiantes. Incluye dashboard, carpetas por grado/sección, búsqueda, filtros, expediente tipo documento, formularios por sección, planes pedagógicos, avances por parcial y exportación imprimible a PDF desde el navegador.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + SQLite local
- Zod para validación
- lucide-react para iconografía

## Comandos

```bash
npm install
npm run prisma:generate
npm run db:apply
npm run dev
```

La app queda disponible en:

```bash
http://127.0.0.1:3000
```

## Verificación

```bash
npm run lint
npm run build
```

## Base de datos

El archivo local se crea en `prisma/dev.db`. El comando `npm run db:apply` aplica el SQL inicial desde `prisma/migrations/202605140001_init/migration.sql`.

Nota: en este entorno con Node 24, `prisma migrate dev` devuelve un `Schema engine error` vacío. El proyecto conserva `prisma/schema.prisma` y una migración SQL equivalente para mantener persistencia local funcional.

## Futuras mejoras preparadas

- Login y roles: administrador, docente y solo lectura.
- Migración a Supabase/Postgres.
- Supabase Storage para adjuntos reales.
- Exportación PDF avanzada.
- Reportes por grado, diagnóstico y estado.
- Historial de cambios y auditoría.
- Importar/exportar Excel.
