# VotaCompa - Sistema de Votación

Sistema de votación para reconocer a compañeros destacados usando Next.js y MySQL.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- MySQL Server 5.7+ instalado y ejecutándose
- npm o yarn

### Instalación

1. **Clonar el repositorio** (si aplica)

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar MySQL**
   
   Ejecuta el script de inicialización de la base de datos:
   ```bash
   mysql -u root -p < init-db.sql
   ```
   
   Esto creará:
   - Base de datos `votacompa`
   - Tabla `colleagues` (empleados)
   - Tabla `votes` (votos)

4. **Configurar variables de entorno**
   
   El archivo `.env.local` ya está creado. Actualiza la cadena de conexión:
   ```env
   DATABASE_URL=mysql://root:tu_contraseña@localhost:3306/votacompa
   ```

5. **Iniciar la aplicación**
   ```bash
   npm run dev
   ```
   
   La app estará disponible en `http://localhost:9002`

## 📖 Documentación

Para más detalles sobre la configuración de MySQL, consulta [docs/MYSQL_SETUP.md](docs/MYSQL_SETUP.md)

## 🛠️ Tecnologías

- **Framework**: Next.js 15
- **Base de datos**: MySQL con mysql2
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Validación**: Zod
- **Formularios**: React Hook Form

## 📁 Estructura del Proyecto

```
src/
├── app/              # Rutas de Next.js
│   ├── vote/        # Página de votación
│   └── admin/       # Panel administrativo
├── components/      # Componentes React
├── lib/
│   ├── db.ts       # Conexión MySQL
│   ├── actions.ts  # Server Actions
│   └── schemas.ts  # Validaciones Zod
└── hooks/          # Custom hooks
```

## 🔑 Características

- ✅ Autenticación por número de nómina
- ✅ Sistema de votación único (un voto por empleado)
- ✅ Carga masiva de empleados vía CSV
- ✅ Panel administrativo para ver resultados
- ✅ Persistencia de datos en MySQL

## 📝 Uso

1. **Cargar empleados**: Ve a `/admin/upload` y carga un CSV con formato: `id,nombre,departamento`
2. **Login**: Ingresa con tu número de nómina
3. **Votar**: Selecciona un compañero y escribe la razón
4. **Ver resultados**: Accede a `/admin/results`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Modo desarrollo
npm run build        # Build para producción
npm start            # Servidor de producción
npm run lint         # Linter
npm run typecheck    # Verificar tipos TypeScript
```

## 🗄️ Base de Datos

### Migración de Datos

Si tenías datos en memoria, necesitarás recargarlos usando el panel de carga masiva.

### Respaldo

```bash
# Crear backup
mysqldump -u root -p votacompa > backup.sql

# Restaurar backup
mysql -u root -p votacompa < backup.sql
```

