# PROJECT MEMORY

## 1. Resumen del proyecto

Estamos construyendo una aplicacion web para gestionar expedientes pedagogicos de estudiantes en un aula pedagogica.

El objetivo principal es permitir registrar, consultar, actualizar, respaldar y exportar informacion pedagogica sensible de forma organizada:

- Datos generales del estudiante.
- Evaluacion diagnostica de lectoescritura.
- Conducta durante evaluacion.
- Evaluacion de inatencion.
- Evaluacion de matematicas.
- Planes de aula pedagogica con documentos adjuntos.
- Avances por parcial.
- Usuarios con login.
- Backups, programacion de backups y restauracion.
- Exportacion de expediente en PDF.

Estado actual:

- La app corre localmente con Next.js 16.2.6, React 19, Prisma 6 y SQLite.
- Hay autenticacion con usuario/contrasena y sesiones en DB.
- Hay panel de administracion en Configuracion.
- Hay backup/restauracion ya subido a GitHub.
- La exportacion PDF real fue implementada y validada localmente, pero todavia no esta subida a GitHub.

## 2. Decisiones tomadas

- Se usa SQLite local mediante Prisma porque el proyecto es local/ligero y no requiere infraestructura externa en esta etapa.
- Se usa autenticacion propia con `User`, `Session`, hash de contrasena con `crypto.scrypt` y cookie `httpOnly`, para evitar dependencias externas.
- Se protege `/dashboard`, `/students`, `/settings` y `/admin` con `src/proxy.ts`.
- Las Server Actions sensibles validan permisos internamente con `requireAdmin()` o `requireEditor()`, porque Next 16 advierte que las Server Actions pueden invocarse por POST directo.
- Se mantuvo `READ_ONLY` como rol de consulta. Puede ver expedientes, pero las acciones de escritura deben quedar bloqueadas en servidor.
- Los backups se guardan fuera del web root, en `storage/backups`, y esa carpeta esta ignorada por Git.
- Los backups se guardan como JSON portable `.backup.json` con la DB SQLite en base64 y los uploads en base64. Se eligio esto para evitar dependencias pesadas.
- La programacion de backups no usa cron real todavia: se ejecuta cuando un administrador abre Configuracion y hay un backup vencido.
- La restauracion exige confirmacion textual `RESTAURAR`, crea backup preventivo y borra sesiones despues de restaurar.
- La exportacion de PDF se implemento como Route Handler en `/students/[id]/export/pdf`, no en el mismo segmento que `page.tsx`, porque Next no permite `page.tsx` y `route.ts` en el mismo nivel.
- El PDF se genera con un builder local minimalista en `src/lib/expedient-pdf.ts`, sin instalar `pdfkit` ni Playwright/Puppeteer.
- El boton de exportacion se mantuvo en `ExpedientHeader`, donde ya existia, pero se cambio de `window.print()` a descarga real.
- Se decidio no versionar `.agents/` ni `skills-lock.json`; son configuracion local de agentes/skills.

## 3. Cambios realizados

Archivos principales modificados o creados:

- `.gitignore`
  - Agrega `/public/uploads/` para documentos subidos.
  - Agrega `/storage/backups/` para backups locales.

- `next.config.ts`
  - Configura `experimental.serverActions.bodySizeLimit = "10mb"` para permitir subida de documentos.

- `prisma/schema.prisma`
  - Agrega modelos `User`, `Session`, `BackupSchedule`.
  - Agrega modelo `MathEvaluation`.
  - Agrega campo `classroomRecommendations` en `ProgressRecord`.

- `prisma/migrations/202605140001_init/migration.sql`
  - Actualiza la migracion inicial para incluir el esquema completo actual.

- `prisma/migrations/202605170001_add_classroom_recommendations/migration.sql`
  - Agrega `classroomRecommendations` a `ProgressRecord`.

- `prisma/migrations/202605170002_add_math_evaluation/migration.sql`
  - Crea tabla `MathEvaluation`.

- `prisma/migrations/202605170003_add_auth_users/migration.sql`
  - Crea tablas `User` y `Session`.

- `prisma/migrations/202605170004_add_backup_schedule/migration.sql`
  - Crea tabla `BackupSchedule`.

- `src/lib/auth.ts`
  - Implementa hash/verificacion de contrasena.
  - Implementa sesiones con cookie `expedientes_session`.
  - Agrega `requireAuth()`, `requireAdmin()` y `requireEditor()`.

- `src/proxy.ts`
  - Protege rutas privadas y redirige a `/login`.
  - Incluye proteccion para `/admin`.

- `src/app/login/page.tsx`
  - Pantalla de login.
  - Permite crear el primer administrador si no hay usuarios.

- `src/components/auth/LoginForm.tsx`
  - Formulario cliente para login/primer admin con `useActionState`.

- `src/lib/actions.ts`
  - Acciones de login, setup admin, logout.
  - Acciones de usuarios en Configuracion.
  - Validacion de permisos en acciones de estudiantes/expediente.
  - Acciones de backup manual, programacion, restauracion y eliminacion de backup.

- `src/lib/validations.ts`
  - Esquemas Zod para estudiante, evaluaciones, planes, avances.
  - Esquemas para login, usuario, backup schedule, restore y backup file.

- `src/lib/queries.ts`
  - Queries de estudiantes/dashboard.
  - `getUsers()`, `getUserCount()`.
  - `getBackupAdminData()` que dispara backups programados vencidos.

- `src/app/settings/page.tsx`
  - Antes era placeholder.
  - Ahora es Administracion: usuarios + backups/restauracion.

- `src/components/settings/UserManagement.tsx`
  - Alta y activacion/desactivacion de usuarios.

- `src/lib/backup.ts`
  - Logica de backup manual/programado.
  - Lista backups.
  - Lee backups para descarga.
  - Restaura DB y uploads.
  - Calcula siguiente ejecucion programada.

- `src/components/settings/BackupManagement.tsx`
  - UI para crear backup, programar backup, restaurar, descargar y eliminar backups.

- `src/app/admin/backups/[fileName]/route.ts`
  - Descarga protegida de backups.

- `src/components/layout/AppShell.tsx`
  - Ahora exige auth y pasa usuario a sidebar/mobile nav.

- `src/components/layout/Sidebar.tsx`
  - Muestra usuario activo y boton de cerrar sesion.

- `src/components/layout/MobileNav.tsx`
  - Muestra usuario activo y logout en movil.

- `src/components/expedient/StudentGeneralForm.tsx`
  - Datos generales quedan en modo visualizacion por defecto.
  - Boton para editar.

- `src/components/expedient/ProgressRecordForm.tsx`
  - Cambia etiqueta a `Recomendaciones de casa`.
  - Agrega `Recomendaciones para adecuacion en el aula`.

- `src/components/expedient/MathEvaluationForm.tsx`
  - Nueva seccion Matematicas.

- `src/components/expedient/InternalNav.tsx`
  - Agrega item `Matematicas`.

- `src/app/students/[id]/page.tsx`
  - Agrega seccion Matematicas.
  - Integra formularios actualizados.

- `src/components/expedient/PedagogicalPlanForm.tsx`
  - Permite subir documento real para planes.

- `src/lib/expedient-pdf.ts`
  - Nuevo generador PDF local.
  - Incluye datos generales, evaluaciones, matematicas, planes, adjuntos y avances.

- `src/app/students/[id]/export/pdf/route.ts`
  - Nuevo endpoint protegido para exportar expediente en PDF.

- `src/components/expedient/ExpedientHeader.tsx`
  - Cambia boton `Exportar PDF` de `window.print()` a enlace real `/students/{id}/export/pdf`.

## 4. Funcionalidades implementadas

Ya funciona:

- Dashboard sin datos demo.
- Estudiantes en tarjetas, tabla y carpetas.
- Filtros de estudiantes responsivos.
- Vista de carpetas mejorada.
- Registro y edicion de datos generales.
- Datos generales como visualizacion por defecto con boton de editar.
- Evaluacion diagnostica.
- Conducta.
- Inatencion.
- Matematicas.
- Planes pedagogicos.
- Subida de documentos para planes.
- Eliminacion de planes/documentos.
- Avances por parcial.
- Recomendaciones de casa.
- Recomendaciones para adecuacion en el aula.
- Login con usuario/contrasena.
- Primer administrador si no hay usuarios.
- Gestion de usuarios desde Configuracion.
- Logout.
- Roles `ADMIN`, `TEACHER`, `READ_ONLY`.
- Backup manual.
- Programacion de backup.
- Restauracion de backup.
- Descarga protegida de backups.
- Exportacion real de expediente en PDF.

Parcialmente implementado:

- Programacion de backups: funciona al abrir Configuracion si hay backup vencido, pero no es cron real.
- Roles: el servidor bloquea escrituras para `READ_ONLY`, pero la UI todavia puede mostrar botones de edicion/eliminacion.
- PDF: genera archivo valido y descargable, pero es un PDF estructurado simple, no replica visualmente el layout web.

Falta validar:

- Exportacion PDF en expedientes con muchos datos largos y multiples paginas.
- Exportacion PDF con varios planes y muchos avances.
- Restore con archivos subidos reales en `public/uploads/plans`.
- Descargar backups con usuario no admin.
- UX de restauracion con datos reales.

## 5. Problemas encontrados

- Next 16/Turbopack daba problemas en este entorno.
  - Solucion: usar `npm run dev -- --webpack --port 3000`.

- Algunos archivos fueron guardados con codificacion no UTF-8 durante una edicion por PowerShell.
  - Sintoma: Next mostraba `stream did not contain valid UTF-8`.
  - Solucion: reescribir archivos afectados en UTF-8.

- Git marco el repo como `dubious ownership`.
  - Solucion usada en comandos: `git -c safe.directory=E:/Proyecto/gestion_expedientes ...`.

- Prisma generate fallo con `EPERM` en Windows porque el dev server tenia bloqueado el query engine.
  - Solucion: detener dev server, correr `npx prisma generate`, levantar dev server otra vez.

- Server Actions por curl sin `Origin` dejaron warning:
  - `Missing origin header from a forwarded Server Actions request`.
  - En pruebas posteriores se uso `Origin: http://localhost:3000`.

- Backup restore inicialmente solo limpiaba la sesion actual.
  - Riesgo: sesiones antiguas incluidas en backup podian revivir.
  - Solucion: despues de restaurar se ejecuta `prisma.session.deleteMany()`.

- El boton anterior de PDF no era exportacion real.
  - Era `window.print()`.
  - Solucion: Route Handler + PDF server-side.

Problemas pendientes:

- Programacion de backups no corre si nadie abre Configuracion.
- UI no oculta todos los botones de escritura para rol `READ_ONLY`.
- El PDF local no soporta acentos como texto unicode en el PDF; se normaliza a ASCII para estabilidad.

## 6. Pendientes

Prioridad alta:

- Subir a GitHub la exportacion PDF real. Cambios pendientes:
  - `src/components/expedient/ExpedientHeader.tsx`
  - `src/app/students/[id]/export/pdf/route.ts`
  - `src/lib/expedient-pdf.ts`
  - `PROJECT_MEMORY.md`

- Probar PDF con expedientes completos y contenido largo.

Prioridad media:

- Ocultar o deshabilitar botones de edicion/eliminacion para usuarios `READ_ONLY`.
- Agregar una tarea de Windows/cron real para backups programados.
- Agregar historial persistente de backups en DB, no solo listado desde filesystem.
- Mejorar el PDF para soportar acentos/unicode o usar `pdfkit` si se quiere mejor tipografia.
- Agregar boton o feedback visual despues de restaurar backup.

Prioridad baja:

- Mejorar nombres/acentos en strings que quedaron en ASCII por seguridad de codificacion.
- Agregar pruebas automatizadas.
- Revisar accesibilidad completa del login, configuracion y exportacion.

Dependencias o bloqueos:

- Para cron real se necesita decidir si sera Windows Task Scheduler, cron externo o endpoint/job protegido.
- Para PDF visualmente mas bonito podria instalarse `pdfkit`, `@react-pdf/renderer` o Playwright, pero se evito por ahora.

## 7. Como correr el proyecto

Instalacion:

```bash
npm install
npx prisma generate
```

Variables de entorno:

```env
DATABASE_URL="file:./dev.db"
```

Crear/aplicar DB local:

```bash
npm run db:apply
```

Levantar dev server recomendado:

```bash
npm run dev -- --webpack --port 3000
```

URL local:

```text
http://localhost:3000
```

URL de red local observada:

```text
http://169.254.83.107:3000
```

Notas:

- Si cambia Prisma y `npx prisma generate` falla con `EPERM`, detener el dev server y reintentar.
- El primer acceso va a `/login`. Si no hay usuarios, permite crear primer administrador.
- Los uploads van a `public/uploads/plans`.
- Los backups van a `storage/backups`.

## 8. Pruebas y verificacion

Pruebas ejecutadas recientemente:

- `npm run lint`: paso.
- `npx tsc --noEmit`: paso.
- Login:
  - Primer admin probado.
  - Login normal probado.
  - Logout probado.
- Rutas protegidas:
  - `/students` sin sesion redirige a `/login`.
  - Descarga de backup sin sesion redirige a `/login`.
- Usuarios:
  - Crear usuario desde Configuracion probado.
  - Activacion/desactivacion basica revisada.
- Backup:
  - Crear backup manual probado.
  - Descargar backup con admin probado.
  - Descargar backup sin sesion probado.
  - Programacion forzada con `nextRunAt` vencido probada.
  - Restauracion probada con estudiante temporal.
  - Limpieza de usuarios/backups temporales realizada.
- PDF:
  - Endpoint sin sesion redirige a `/login`.
  - Endpoint con sesion devuelve `200 OK`.
  - `Content-Type: application/pdf`.
  - `Content-Disposition` con nombre `expediente-edman-gomez.pdf`.
  - Archivo empieza con `%PDF-`.
  - Boton aparece en expediente.

Pruebas que faltan:

- Abrir visualmente el PDF generado para revisar layout.
- Probar PDF con datos largos/multipagina.
- Probar restore con uploads reales.
- Probar usuario `READ_ONLY` en UI.
- Probar backup programado durante multiples cargas simultaneas.

## 9. Contexto importante para el proximo Codex

Cosas que no debe olvidar:

- Leer `AGENTS.md`: este proyecto advierte que Next.js tiene cambios importantes y se deben revisar docs locales en `node_modules/next/dist/docs/`.
- Usar `npm run dev -- --webpack --port 3000`; Webpack ha sido mas estable que Turbopack aqui.
- No revertir cambios existentes del usuario ni cambios ya hechos.
- Hay un usuario real en la DB: `laura`.
- No versionar `.agents/` ni `skills-lock.json` salvo que el usuario lo pida explicitamente.
- No versionar `public/uploads/` ni `storage/backups/`.
- El repo remoto es `https://github.com/edmangomez/expedientes_pedagogicos.git`.
- Rama principal: `main`.
- Ultimo commit subido: `c7cbb11 Add admin backup and restore tools`.
- Cambios PDF y `PROJECT_MEMORY.md` estan pendientes de commit/push.

Archivos clave para revisar primero:

- `src/app/students/[id]/page.tsx`
- `src/components/expedient/ExpedientHeader.tsx`
- `src/lib/expedient-pdf.ts`
- `src/app/students/[id]/export/pdf/route.ts`
- `src/lib/auth.ts`
- `src/lib/actions.ts`
- `src/lib/backup.ts`
- `src/app/settings/page.tsx`
- `src/components/settings/BackupManagement.tsx`
- `src/components/settings/UserManagement.tsx`
- `prisma/schema.prisma`

Advertencias:

- Las Server Actions deben validar permisos internamente.
- `READ_ONLY` no debe poder modificar datos aunque la UI muestre botones.
- Restaurar backup reemplaza DB y uploads.
- Restaurar backup borra sesiones para forzar re-login.
- Si se edita con PowerShell, asegurar UTF-8 valido.
- Si se usa Git y aparece `dubious ownership`, usar `git -c safe.directory=E:/Proyecto/gestion_expedientes ...`.

Proximo paso recomendado:

1. Revisar visualmente un PDF exportado.
2. Si se ve aceptable, hacer commit y push de la exportacion PDF junto con `PROJECT_MEMORY.md`.
3. Luego mejorar UI para usuarios `READ_ONLY` y/o implementar cron real para backups.
