# Configuración de MySQL para VotaCompa

Este proyecto ahora utiliza MySQL como base de datos.

## Requisitos Previos

- MySQL Server 5.7 o superior instalado
- Node.js y npm instalados

## Configuración

### 1. Instalar Dependencias

Las dependencias ya están instaladas, pero si necesitas reinstalarlas:

```bash
npm install
```

### 2. Configurar la Base de Datos

#### Opción A: Configuración Manual

1. Inicia tu servidor MySQL
2. Ejecuta el script de inicialización:

```bash
mysql -u root -p < init-db.sql
```

#### Opción B: Desde MySQL Workbench o phpMyAdmin

1. Abre el archivo `init-db.sql`
2. Ejecuta el script completo en tu herramienta de administración MySQL

### 3. Configurar Variables de Entorno

El archivo `.env.local` ya está creado. Actualiza la cadena de conexión según tu configuración:

```env
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/votacompa
```

**Parámetros:**
- `usuario`: Tu usuario de MySQL (por defecto: `root`)
- `contraseña`: La contraseña de tu usuario MySQL
- `localhost`: El host de tu servidor MySQL
- `3306`: El puerto de MySQL (por defecto: 3306)
- `votacompa`: El nombre de la base de datos

### 4. Iniciar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:9002`

## Estructura de la Base de Datos

### Tabla: `colleagues`
- `id` (VARCHAR 50): ID único del empleado (PRIMARY KEY)
- `name` (VARCHAR 255): Nombre completo
- `department` (VARCHAR 255): Departamento
- `photoUrl` (TEXT): URL de la foto del empleado
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

### Tabla: `votes`
- `id` (INT): ID autoincremental (PRIMARY KEY)
- `voterId` (VARCHAR 50): ID del votante
- `candidateId` (VARCHAR 50): ID del candidato
- `reason` (TEXT): Razón del voto
- `timestamp`: Fecha y hora del voto

## Solución de Problemas

### Error de Conexión

Si obtienes un error de conexión:
1. Verifica que MySQL esté ejecutándose
2. Comprueba que las credenciales en `.env.local` sean correctas
3. Asegúrate de que la base de datos `votacompa` exista

### Error: "Client does not support authentication protocol"

Si usas MySQL 8.0+, ejecuta:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';
FLUSH PRIVILEGES;
```

## Migración desde In-Memory

Los datos anteriores almacenados en memoria se perderán. Para cargar empleados:

1. Ve a `/admin/upload`
2. Carga el archivo CSV con los empleados
3. El formato debe ser: `id,nombre,departamento`

## Respaldo de Datos

Para crear un respaldo de la base de datos:

```bash
mysqldump -u root -p votacompa > backup.sql
```

Para restaurar:

```bash
mysql -u root -p votacompa < backup.sql
```
