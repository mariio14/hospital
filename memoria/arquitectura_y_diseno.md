# Arquitectura y Diseño del Sistema de Gestión Hospitalaria

## Índice

1. [Introducción](#introducción)
2. [Arquitectura General del Sistema](#arquitectura-general-del-sistema)
3. [Arquitectura del Frontend](#arquitectura-del-frontend)
4. [Arquitectura del Backend](#arquitectura-del-backend)
5. [Subsistema de Optimización de Planificación](#subsistema-de-optimización-de-planificación)
6. [Diseño de Base de Datos](#diseño-de-base-de-datos)
7. [Arquitectura de Seguridad](#arquitectura-de-seguridad)
8. [Pipeline de Construcción y Despliegue](#pipeline-de-construcción-y-despliegue)
9. [Justificación de Decisiones de Diseño](#justificación-de-decisiones-de-diseño)
10. [Diagramas de Arquitectura](#diagramas-de-arquitectura)

## Introducción

El sistema de gestión hospitalaria desarrollado en este Trabajo de Fin de Grado (TFG) es una aplicación web completa que integra tecnologías modernas tanto en el frontend como en el backend, con un enfoque especial en la optimización de la planificación de turnos y asignaciones de personal médico mediante programación lógica con restricciones.

El sistema está diseñado para gestionar de manera eficiente la asignación de tareas hospitalarias como guardias presenciales, guardias localizadas, extracciones e implantes, garantizando el cumplimiento de restricciones laborales y optimizando la distribución de cargas de trabajo.

## Arquitectura General del Sistema

### Patrón Arquitectónico

El sistema sigue una **arquitectura de tres capas** (3-tier architecture) con separación clara de responsabilidades:

1. **Capa de Presentación (Frontend)**: Interfaz de usuario desarrollada en React
2. **Capa de Lógica de Negocio (Backend)**: API REST desarrollada con Spring Boot
3. **Capa de Datos**: Base de datos relacional con persistencia JPA/Hibernate

Adicionalmente, se incorpora un **subsistema de optimización** basado en Python clingo que actúa como un servicio especializado para la resolución de problemas de planificación con restricciones.

### Comunicación entre Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE WEB                              │
│                  (Navegador)                                │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS + JSON
                      │ (REST API Calls)
┌─────────────────────▼───────────────────────────────────────┐
│                  FRONTEND                                   │
│             React 18.2.0 + Redux                           │
│          Bootstrap + React Router                           │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS + JSON
                      │ (API REST)
┌─────────────────────▼───────────────────────────────────────┐
│                  BACKEND                                    │
│            Spring Boot 3.1.3                               │
│         Controllers + Services + JPA                        │
└─────────────────────┬───────────┬─────────────────────────────┘
                      │           │ Process Execution
                      │           │ (JSON I/O)
                      │           ▼
                      │    ┌─────────────────┐
                      │    │   OPTIMIZACIÓN  │
                      │    │  Python clingo  │
                      │    │  Constraint LP  │
                      │    └─────────────────┘
                      │
                      │ JPA/Hibernate
                      │ (SQL Queries)
┌─────────────────────▼───────────────────────────────────────┐
│                BASE DE DATOS                                │
│            MariaDB / H2 Database                            │
└─────────────────────────────────────────────────────────────┘
```

## Arquitectura del Frontend

### Tecnologías Principales

- **React 18.2.0**: Biblioteca principal para construir la interfaz de usuario
- **Redux**: Gestión del estado global de la aplicación
- **React Router 6.20.1**: Enrutamiento y navegación
- **Bootstrap 5.3.3**: Framework CSS para diseño responsivo
- **jsPDF**: Generación de reportes en formato PDF

### Estructura Modular

El frontend está organizado siguiendo una **arquitectura modular por características** (feature-based architecture):

```
frontend/src/
├── modules/
│   ├── app/                    # Módulo principal
│   ├── users/                  # Gestión de usuarios
│   ├── plannings/              # Planificación (core business logic)
│   │   ├── components/
│   │   │   ├── WeeklyPlanning.js
│   │   │   ├── MonthlyPlanning.js
│   │   │   └── YearlyPlanning.js
│   │   ├── actions/
│   │   ├── actionTypes/
│   │   ├── reducer/
│   │   └── selectors/
│   └── common/                 # Componentes compartidos
├── backend/                    # Capa de comunicación con API
├── config/                     # Configuración
└── store/                      # Configuración de Redux
```

### Flujo de Datos (Redux Pattern)

```
┌─────────────────┐    dispatch(action)    ┌─────────────────┐
│   COMPONENTE    │────────────────────────▶│     ACTIONS     │
│     REACT       │                        │                 │
└─────────────────┘                        └─────────────────┘
         ▲                                           │
         │                                           │
         │ connect/useSelector                       ▼
         │                                  ┌─────────────────┐
┌─────────────────┐                        │    REDUCERS     │
│      STORE      │◀───────────────────────│   (Pure Funcs)  │
│   (State Tree)  │    update state        │                 │
└─────────────────┘                        └─────────────────┘
```

### Componentes Principales

#### 1. WeeklyPlanning Component
Gestiona la planificación semanal con las siguientes funcionalidades:
- Visualización en formato tabla por días y personas
- Edición inline de asignaciones
- Validación de restricciones en tiempo real
- Exportación a PDF

#### 2. MonthlyPlanning Component
Maneja la planificación mensual con:
- Calendario mensual interactivo
- Códigos de color para diferentes tipos de tareas
- Generación automática basada en restricciones
- Confirmación y persistencia de planes

### Gestión del Estado

El estado global de la aplicación se estructura en los siguientes dominios:

```javascript
{
  app: {
    error: null,
    loading: false
  },
  users: {
    user: null,
    serviceToken: null
  },
  plannings: {
    weekly: { ... },
    monthly: { ... },
    yearly: { ... },
    staff: [ ... ],
    priorities: [ ... ]
  }
}
```

## Arquitectura del Backend

### Tecnologías Principales

- **Spring Boot 3.1.3**: Framework principal
- **Java 17**: Lenguaje de programación
- **Spring Security**: Autenticación y autorización
- **Spring Data JPA**: Acceso a datos
- **JWT**: Tokens para autenticación stateless
- **Jackson**: Serialización/deserialización JSON

### Patrón de Arquitectura por Capas

```
┌─────────────────────────────────────────────────────────────┐
│                CAPA DE PRESENTACIÓN                         │
│              @RestController                                │
│    PlanningController, StaffController,                     │
│         PrioritiesController, UserController                │
└─────────────────────┬───────────────────────────────────────┘
                      │ DTOs
┌─────────────────────▼───────────────────────────────────────┐
│                CAPA DE NEGOCIO                              │
│                  @Service                                   │
│     PlanningService, StaffService,                          │
│        PrioritiesService, UserService                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ Entities
┌─────────────────────▼───────────────────────────────────────┐
│              CAPA DE ACCESO A DATOS                         │
│                @Entity + JPA                                │
│       Staff, Priority, ActivityAndPlanning                  │
└─────────────────────────────────────────────────────────────┘
```

### Controladores REST

#### 1. PlanningController (`/api/plannings`)
Endpoints principales:
- `POST /generateYearly`: Genera planificación anual
- `POST /generateMonthly`: Genera planificación mensual  
- `POST /generateWeekly`: Genera planificación semanal
- `POST /checkWeekly`: Valida cambios en planificación semanal
- `GET /getWeekly`: Obtiene planificación semanal existente

#### 2. StaffController (`/api/staff`)
- `GET /`: Lista todo el personal
- `PUT /modify`: Modifica configuración del personal

#### 3. PrioritiesController (`/api/priorities`)
- `GET /`: Obtiene configuración de prioridades
- `PUT /modify`: Modifica prioridades
- `PUT /original`: Restaura prioridades por defecto

### Servicios de Negocio

#### PlanningService
Servicio principal que encapsula la lógica de planificación:

```java
@Service
@Transactional
public class PlanningServiceImpl implements PlanningService {
    
    // Generación de planificación anual
    public void generateYearlyPlanning(...)
    
    // Generación de planificación mensual
    public void generateMonthlyPlanning(...)
    
    // Generación de planificación semanal
    public void generateWeeklyPlanning(...)
    
    // Validación de cambios
    public void checkWeeklyPlanning(...)
    
    // Integración con Python clingo
    private void executeCligoScript(...)
}
```

### DTOs (Data Transfer Objects)

Se utilizan DTOs para desacoplar la representación interna de datos de la API externa:

- `WeeklyPlanningDto`: Representa la planificación semanal
- `MonthlyPlanningDto`: Representa la planificación mensual
- `StaffDto`: Información del personal
- `PriorityGroupDto`: Configuración de prioridades

## Subsistema de Optimización de Planificación

### Tecnología: Python clingo

El subsistema de optimización utiliza **clingo**, un solver de Answer Set Programming (ASP) que permite resolver problemas de satisfacción de restricciones complejas.

### Arquitectura del Subsistema

```
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND JAVA                               │
│               PlanningService                               │
└─────────────────────┬───────────────────────────────────────┘
                      │ 1. Genera archivo .lp con datos
                      │ 2. Ejecuta script Python
                      │ 3. Lee resultado JSON
┌─────────────────────▼───────────────────────────────────────┐
│                PYTHON SCRIPTS                               │
│  ┌─────────────────┬─────────────────┬─────────────────┐    │
│  │ decode_yearly.py│decode_monthly.py│decode_weekly.py │    │
│  └─────────────────┴─────────────────┴─────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │ clingo execution
┌─────────────────────▼───────────────────────────────────────┐
│                 CLINGO SOLVER                               │
│  ┌─────────────────┬─────────────────┬─────────────────┐    │
│  │    yearly.lp    │   monthly.lp    │   weekly.lp     │    │
│  └─────────────────┴─────────────────┴─────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │ Solution output
┌─────────────────────▼───────────────────────────────────────┐
│                 JSON RESULTS                                │
│  ┌─────────────────┬─────────────────┬─────────────────┐    │
│  │solution_yearly  │solutionMonthly  │solutionWeekly   │    │
│  └─────────────────┴─────────────────┴─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Tipos de Planificación

#### 1. Planificación Anual
- **Archivo**: `yearly.lp`
- **Script**: `decode_yearly.py`
- **Objetivo**: Distribución equilibrada de vacaciones y cargas anuales

#### 2. Planificación Mensual
- **Archivo**: `monthly.lp`
- **Script**: `decode_monthly.py`
- **Objetivo**: Asignación de guardias y turnos mensuales
- **Restricciones**: 
  - Guardias presenciales (G, GP)
  - Guardias localizadas (E, I)
  - Personas de comodín (C)
  - Restricciones de vacaciones
  - Distribución equitativa de fines de semana

#### 3. Planificación Semanal
- **Archivo**: `weekly.lp`
- **Script**: `decode_weekly.py` 
- **Objetivo**: Asignación detallada semanal
- **Funcionalidades**: Validación de cambios manuales

### Restricciones Principales (Ejemplo Mensual)

```prolog
% Al menos una persona de comodín diariamente
MensualR_C1: comodin(Person, Day) :- ...

% Si está de vacaciones no se le asigna nada
MensualR_V1: :- vacation(Person, Day), assignment(Person, Day, _).

% Minimizar residentes con guardias en fin de semana
MensualP_G10: #minimize { 1@3 : weekend_guard(Person) }.

% R5 no hacen guardias juntos
MensualR_G14: :- assignment(Person1, Day, G), assignment(Person2, Day, G),
                 r5(Person1), r5(Person2), Person1 != Person2.
```

## Diseño de Base de Datos

### Modelo Conceptual

El sistema utiliza un modelo de base de datos relacional simple pero efectivo:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      STAFF      │    │   PRIORITIES    │    │ ACTIVITY_AND_   │
│                 │    │                 │    │   PLANNING      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ name            │    │ group_type      │    │ year            │
│ surname         │    │ priority_name   │    │ month           │
│ group_type      │    │ priority_value  │    │ week            │
│ resident_year   │    │ active          │    │ day             │
│ active          │    └─────────────────┘    │ person_name     │
└─────────────────┘                           │ assignment      │
                                              │ activity_type   │
                                              │ color           │
                                              └─────────────────┘
```

### Estrategia de Persistencia

#### Configuración JPA/Hibernate

```yaml
# application.yml
spring:
  jpa:
    hibernate:
      ddl-auto: create  # Desarrollo
    database-platform: org.hibernate.dialect.H2Dialect
    show-sql: false
```

#### Entidades Principales

**Staff Entity:**
```java
@Entity
@Table(name = "staff")
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "group_type")
    private String groupType;
    
    @Column(name = "resident_year")
    private String residentYear;
    
    // getters, setters, constructors
}
```

### Base de Datos en Desarrollo vs Producción

- **Desarrollo**: H2 in-memory database para rapidez y simplicidad
- **Producción**: MariaDB para persistencia y rendimiento
- **Configuración**: Overrideable via command-line parameters

## Arquitectura de Seguridad

### Estrategia de Autenticación: JWT

El sistema implementa autenticación basada en **JSON Web Tokens (JWT)** para mantener un estado stateless en el servidor.

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                   │
└─────────────────────────────────────────────────────────────┘

1. Usuario → POST /api/users/login {username, password}
                    │
2. Backend valida credenciales
                    │
3. Backend genera JWT token
                    │
4. Cliente almacena token en sessionStorage
                    │
5. Requests subsiguientes incluyen header:
   Authorization: Bearer <jwt_token>
                    │
6. Backend valida token en cada request
```

### Configuración de Seguridad

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
            .csrf().disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/users/login", "/api/users/loginFromServiceToken")
                    .permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

### Configuración JWT

```yaml
# application.yml
project:
  jwt:
    signKey: WzROun12eUiDvko3UrJ74gNeJz2TWEWPMTh6DxyE8HWXIf4hETUrkM4IUGqqHq66PuVS
    expirationMinutes: 1440  # 24 horas
```

### Usuarios de Prueba

El sistema incluye usuarios predefinidos para testing:
- **admin/test**: Usuario administrador
- **test/test**: Usuario estándar

## Pipeline de Construcción y Despliegue

### Proceso de Build Integrado

El proyecto utiliza **Maven** como herramienta principal de build que orquesta tanto la construcción del backend como del frontend.

```
┌─────────────────────────────────────────────────────────────┐
│                    MAVEN BUILD LIFECYCLE                   │
└─────────────────────────────────────────────────────────────┘

1. generate-resources:
   ├── Install Node.js v18.12.0 + Yarn v1.22.19
   ├── yarn install (dependencies)
   ├── yarn test (frontend tests)
   └── yarn build (React production build)

2. prepare-package:
   └── Copy frontend build → target/classes/public/

3. compile:
   └── Compile Java sources

4. test:
   ├── Run backend tests (JUnit)
   └── Generate Jacoco coverage report

5. package:
   └── Create executable JAR with embedded frontend
```

### Configuración Frontend-Maven-Plugin

```xml
<plugin>
    <groupId>com.github.eirslett</groupId>
    <artifactId>frontend-maven-plugin</artifactId>
    <configuration>
        <workingDirectory>frontend</workingDirectory>
        <installDirectory>target</installDirectory>
        <environmentVariables>
            <ESLINT_NO_DEV_ERRORS>true</ESLINT_NO_DEV_ERRORS>
            <CI>false</CI>
        </environmentVariables>
    </configuration>
</plugin>
```

### Artefactos de Salida

- **JAR ejecutable**: `target/myTfg-0.1-SNAPSHOT.jar`
- **Contenido**: Backend + Frontend estáticos + Dependencias
- **Deployment**: Single JAR deployment con Tomcat embebido

### Configuración de Desarrollo vs Producción

#### Desarrollo
```bash
# Backend development
mvn spring-boot:run

# Frontend development  
cd frontend && yarn start  # Proxy a localhost:8080
```

#### Producción
```bash
# Build completo
mvn clean package -DskipTests=true

# Ejecución con H2
java -jar target/myTfg-0.1-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:h2:mem:testdb \
  --spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

## Justificación de Decisiones de Diseño

### 1. Arquitectura de Tres Capas

**Decisión**: Separar presentación, lógica de negocio y acceso a datos.

**Justificación**:
- **Mantenibilidad**: Cada capa tiene responsabilidades claras
- **Escalabilidad**: Permite escalar componentes independientemente  
- **Testabilidad**: Facilita unit testing y mocking
- **Reutilización**: Lógica de negocio reutilizable desde múltiples frontends

### 2. Single Page Application (SPA) con React

**Decisión**: React + Redux para el frontend.

**Justificación**:
- **UX Superior**: Navegación fluida sin recargas de página
- **Estado Predictible**: Redux proporciona gestión de estado predecible
- **Componentes Reutilizables**: Arquitectura modular y mantenible
- **Ecosistema Maduro**: Gran cantidad de librerías y herramientas

### 3. API REST con Spring Boot

**Decisión**: API REST stateless con JWT.

**Justificación**:
- **Escalabilidad**: Stateless permite escalado horizontal
- **Interoperabilidad**: REST es estándar industrial
- **Seguridad**: JWT elimina necesidad de sesiones en servidor
- **Flexibilidad**: Permite múltiples clientes (web, mobile, etc.)

### 4. Integración con Python clingo

**Decisión**: Subprocess execution para optimización.

**Justificación**:
- **Especialización**: clingo es herramienta específica para constraint solving
- **Rendimiento**: C++ backend de clingo es altamente optimizado
- **Flexibilidad**: Permite modificar lógica de restricciones sin recompilar Java
- **Investigación**: Facilita experimentación con diferentes modelos

**Alternativas consideradas**:
- **JVM-based solvers**: Menor rendimiento para este dominio específico
- **Web services**: Overhead innecesario para uso local
- **Direct integration**: Mayor complejidad sin beneficios claros

### 5. Base de Datos Híbrida (H2/MariaDB)

**Decisión**: H2 para desarrollo, MariaDB para producción.

**Justificación**:
- **Desarrollo Rápido**: H2 no requiere setup de infraestructura
- **Producción Robusta**: MariaDB ofrece ACID y concurrencia
- **Configurabilidad**: Override fácil via command-line
- **Testing**: H2 in-memory ideal para tests automatizados

### 6. Build Pipeline Integrado

**Decisión**: Maven orquesta build de frontend y backend.

**Justificación**:
- **Single Command Deploy**: Un solo comando para build completo
- **Atomic Deployments**: JAR contiene aplicación completa
- **CI/CD Friendly**: Pipeline simple para integración continua
- **Versionado Consistente**: Frontend y backend siempre compatibles

### 7. Modularización por Características

**Decisión**: Organización de código por dominio de negocio, no por tipo técnico.

**Justificación**:
- **Cohesión**: Código relacionado permanece junto
- **Mantenimiento**: Cambios en una característica localizados
- **Equipos**: Facilita trabajo en paralelo
- **Comprensión**: Estructura refleja modelo mental del dominio

## Diagramas de Arquitectura

### Diagrama 1: Arquitectura General del Sistema

```
                              SISTEMA DE GESTIÓN HOSPITALARIA
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                                CAPA DE PRESENTACIÓN                                 │
    │  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
    │  │                            REACT FRONTEND                                       │ │
    │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
    │  │  │   Planning   │  │    Users     │  │    Staff     │  │  Priorities  │     │ │
    │  │  │   Modules    │  │   Module     │  │   Module     │  │   Module     │     │ │
    │  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │ │
    │  │                                                                               │ │
    │  │  ┌─────────────────────────────────────────────────────────────────────────┐ │ │
    │  │  │                        REDUX STORE                                      │ │ │
    │  │  │    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │ │ │
    │  │  │    │   App   │ │  Users  │ │Planning │ │  Staff  │ │Priority │       │ │ │
    │  │  │    │  State  │ │  State  │ │  State  │ │  State  │ │  State  │       │ │ │
    │  │  │    └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │ │ │
    │  │  └─────────────────────────────────────────────────────────────────────────┘ │ │
    │  └─────────────────────────────────────────────────────────────────────────────────┘ │
    └─────────────────────────────┬───────────────────────────────────────────────────────┘
                                  │ HTTP/JSON (REST API)
    ┌─────────────────────────────▼───────────────────────────────────────────────────────┐
    │                              CAPA DE LÓGICA DE NEGOCIO                              │
    │  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
    │  │                           SPRING BOOT BACKEND                                   │ │
    │  │                                                                                 │ │
    │  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
    │  │  │                          REST CONTROLLERS                                │  │ │
    │  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │  │ │
    │  │  │  │  Planning  │ │    User    │ │   Staff    │ │ Priorities │          │  │ │
    │  │  │  │Controller  │ │Controller  │ │Controller  │ │Controller  │          │  │ │
    │  │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │  │ │
    │  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
    │  │                                     │                                            │ │
    │  │  ┌──────────────────────────────────▼──────────────────────────────────────┐  │ │
    │  │  │                            SERVICES LAYER                               │  │ │
    │  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │  │ │
    │  │  │  │  Planning  │ │    User    │ │   Staff    │ │ Priorities │          │  │ │
    │  │  │  │  Service   │ │  Service   │ │  Service   │ │  Service   │          │  │ │
    │  │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │  │ │
    │  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
    │  │                                     │                                            │ │
    │  │  ┌──────────────────────────────────▼──────────────────────────────────────┐  │ │
    │  │  │                            JPA ENTITIES                                 │  │ │
    │  │  │    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────────────────┐ │  │ │
    │  │  │    │  Staff  │ │Priority │ │  User   │ │    ActivityAndPlanning      │ │  │ │
    │  │  │    │ Entity  │ │ Entity  │ │ Entity  │ │        Entity               │ │  │ │
    │  │  │    └─────────┘ └─────────┘ └─────────┘ └─────────────────────────────┘ │  │ │
    │  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
    │  └─────────────────────────────────────────────────────────────────────────────────┘ │
    └─────────────────┬───────────────────────────────────┬───────────────────────────────┘
                      │                                   │
                      │ JPA/Hibernate                     │ Process Execution
                      │ (SQL)                             │ (JSON Files)
    ┌─────────────────▼───────────────────────────────────┐ │
    │            CAPA DE DATOS                            │ │
    │  ┌─────────────────────────────────────────────────┐ │ │
    │  │                DATABASE                         │ │ │
    │  │                                                 │ │ │
    │  │  ┌─────────┐ ┌─────────┐ ┌─────────────────────┐ │ │ │
    │  │  │  STAFF  │ │PRIORITY │ │  ACTIVITY_PLANNING  │ │ │ │
    │  │  │  TABLE  │ │  TABLE  │ │       TABLE         │ │ │ │
    │  │  └─────────┘ └─────────┘ └─────────────────────┘ │ │ │
    │  │                                                 │ │ │
    │  │         MariaDB (Production)                    │ │ │
    │  │         H2 Database (Development)               │ │ │
    │  └─────────────────────────────────────────────────┘ │ │
    └─────────────────────────────────────────────────────────┘ │
                                                                │
    ┌───────────────────────────────────────────────────────────▼─┐
    │                SUBSISTEMA DE OPTIMIZACIÓN                   │
    │  ┌─────────────────────────────────────────────────────────┐ │
    │  │                   PYTHON CLINGO                         │ │
    │  │                                                         │ │
    │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │ │
    │  │  │decode_yearly │ │decode_monthly│ │ decode_weekly    │ │ │
    │  │  │    .py       │ │    .py       │ │     .py          │ │ │
    │  │  └──────────────┘ └──────────────┘ └──────────────────┘ │ │
    │  │                         │                               │ │
    │  │  ┌──────────────┐ ┌──────▼──────┐ ┌──────────────────┐ │ │
    │  │  │  yearly.lp   │ │ monthly.lp  │ │   weekly.lp      │ │ │
    │  │  │ (Constraints)│ │(Constraints)│ │ (Constraints)    │ │ │
    │  │  └──────────────┘ └─────────────┘ └──────────────────┘ │ │
    │  │                                                         │ │
    │  │              CLINGO SOLVER ENGINE                       │ │
    │  │              (Answer Set Programming)                   │ │
    │  └─────────────────────────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────────────┘
```

### Diagrama 2: Flujo de Datos para Generación de Planificación

```
                            FLUJO DE GENERACIÓN DE PLANIFICACIÓN

    ┌─────────────────┐
    │   USUARIO WEB   │
    │   (Frontend)    │
    └────────┬────────┘
             │ 1. Solicita generar
             │    planificación mensual
             ▼
    ┌─────────────────┐
    │   FRONTEND      │ 2. dispatch(generateMonthlyPlanning)
    │ (PlanningModule)│
    └────────┬────────┘
             │ 3. HTTP POST /api/plannings/generateMonthly
             ▼
    ┌─────────────────┐
    │ PlanningController │ 4. Valida request
    │   (@RestController)│    Convierte DTOs
    └────────┬────────┘
             │ 5. Invoca servicio
             ▼
    ┌─────────────────┐
    │ PlanningService │ 6. Obtiene staff y prioridades
    │   (@Service)    │    Construye parámetros clingo
    └────────┬────────┘
             │ 7. Genera archivo input_monthly.lp
             │    con facts y constraints
             ▼
    ┌─────────────────┐
    │   FILE SYSTEM   │ 8. Escribe parámetros
    │input_monthly.lp │    de entrada
    └────────┬────────┘
             │
    ┌────────▼────────┐ 9. Ejecuta comando:
    │ PlanningService │    python3 decode_monthly.py monthly.lp
    │executeCligoScript│    
    └────────┬────────┘
             │ 10. Subprocess execution
             ▼
    ┌─────────────────┐
    │  PYTHON SCRIPT  │ 11. Carga monthly.lp e input_monthly.lp
    │decode_monthly.py│     Ejecuta clingo solver
    └────────┬────────┘
             │ 12. clingo --models=1 monthly.lp input_monthly.lp
             ▼
    ┌─────────────────┐
    │  CLINGO SOLVER  │ 13. Resuelve constraints
    │ (ASP Engine)    │     Encuentra modelo óptimo
    └────────┬────────┘
             │ 14. Retorna solution atoms
             ▼
    ┌─────────────────┐
    │  PYTHON SCRIPT  │ 15. Parsea output de clingo
    │decode_monthly.py│     Genera JSON estructurado
    └────────┬────────┘
             │ 16. Escribe solutionMonthly.json
             ▼
    ┌─────────────────┐
    │   FILE SYSTEM   │ 17. Archivo JSON con
    │solutionMonthly  │     asignaciones generadas
    │     .json       │
    └────────┬────────┘
             │
    ┌────────▼────────┐ 18. Lee resultado JSON
    │ PlanningService │     Convierte a entidades
    │ saveMonthJson   │
    └────────┬────────┘
             │ 19. Persiste en base de datos
             │     (ActivityAndPlanning entities)
             ▼
    ┌─────────────────┐
    │   DATABASE      │ 20. Almacena planificación
    │  (JPA/Hibernate)│
    └────────┬────────┘
             │ 21. Retorna resultado
             ▼
    ┌─────────────────┐
    │ PlanningController │ 22. Retorna HTTP 200 OK
    │   Response      │
    └────────┬────────┘
             │ 23. JSON Response
             ▼
    ┌─────────────────┐
    │   FRONTEND      │ 24. Actualiza Redux store
    │ (Redux Action)  │     Actualiza UI
    └────────┬────────┘
             │ 25. Re-render components
             ▼
    ┌─────────────────┐
    │   USUARIO WEB   │ 26. Ve planificación generada
    │   (Frontend)    │     Puede exportar PDF
    └─────────────────┘

                    DATOS PRINCIPALES EN CADA ETAPA:

    Request (3):  { year: 2024, month: "ENERO", staff: [...], priorities: [...] }
                          ↓
    Input LP (7): staff("Juan Pérez", "R1").
                  priority("guardia", 5).
                  month_days(31).
                          ↓
    Clingo (12):  assignment("Juan Pérez", 1, "G").
                  assignment("Ana López", 2, "E").
                          ↓
    JSON (16):    { "2024": { "ENERO": [
                    { "Juan Pérez": { "1": "G", "2": "-", ... } },
                    { "Ana López": { "1": "-", "2": "E", ... } }
                  ]}}
                          ↓
    Database (19): ActivityAndPlanning(year=2024, month="ENERO", 
                                      person="Juan Pérez", day=1, assignment="G")
```

### Diagrama 3: Arquitectura de Seguridad JWT

```
                               ARQUITECTURA DE SEGURIDAD JWT

    ┌─────────────────┐                                    ┌─────────────────┐
    │   USUARIO WEB   │                                    │   BACKEND API   │
    │   (Browser)     │                                    │  (Spring Boot)  │
    └────────┬────────┘                                    └────────┬────────┘
             │                                                      │
             │ 1. POST /api/users/login                             │
             │    { username, password }                            │
             ├─────────────────────────────────────────────────────▶│
             │                                                      │
             │                              2. Validate credentials │
             │                                 BCryptPasswordEncoder│
             │                                                   ┌──▼───┐
             │                                                   │ User │
             │                                                   │ DB   │
             │                                                   └──┬───┘
             │                              3. Generate JWT token   │
             │                                 JwtGenerator.generate │
             │                                                      ▼
             │                              ┌─────────────────────────────────┐
             │                              │          JWT TOKEN              │
             │                              │  Header: { "alg": "HS256" }     │
             │                              │  Payload: {                     │
             │                              │    "sub": "admin",              │
             │                              │    "exp": 1640995200,          │
             │                              │    "iat": 1640908800           │
             │                              │  }                              │
             │                              │  Signature: HMACSHA256(...)     │
             │                              └─────────────────────────────────┘
             │                                                      │
             │ 4. Response: { serviceToken: "<JWT>" }              │
             ◀─────────────────────────────────────────────────────┤
             │                                                      │
             ▼                                                      │
    ┌─────────────────┐                                             │
    │  sessionStorage │ 5. Store JWT                               │
    │ serviceToken:   │    sessionStorage.setItem(...)             │
    │ "eyJhbGciOiJ..." │                                             │
    └─────────────────┘                                             │
                                                                    │
    ┌─────────────────┐                                             │
    │ SUBSEQUENT      │                                             │
    │ API REQUESTS    │                                             │
    └────────┬────────┘                                             │
             │                                                      │
             │ 6. HTTP Request                                      │
             │    Authorization: Bearer <JWT>                       │
             ├─────────────────────────────────────────────────────▶│
             │                                                      │
             │                               7. JWT Filter validates│
             │                                  JwtAuthenticationFilter │
             │                                                   ┌──▼───────┐
             │                                                   │ JWT      │
             │                                                   │Validator │
             │                                                   └──┬───────┘
             │                                                      │
             │                               8a. Token válido       │
             │                                   → SecurityContext  │
             │                               8b. Token inválido     │
             │                                   → 401 Unauthorized │
             │                                                      │
             │ 9. Response (if authorized)                          │
             ◀─────────────────────────────────────────────────────┤
             │                                                      │

                        COMPONENTES DE SEGURIDAD:

    ┌─────────────────────────────────────────────────────────────────────┐
    │                      SPRING SECURITY CHAIN                         │
    │                                                                     │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
    │  │  CORS Filter    │  │ JWT Auth Filter │  │  Authorization  │    │
    │  │                 │─▶│                 │─▶│    Manager      │    │
    │  │ Allow Origins   │  │ Validate Token  │  │ Check Roles     │    │
    │  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
    │                                                                     │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
    │  │   BCrypt        │  │ JWT Generator   │  │  SecurityContext│    │
    │  │ PasswordEncoder │  │                 │  │    Holder       │    │
    │  │                 │  │ Sign/Verify     │  │                 │    │
    │  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
    └─────────────────────────────────────────────────────────────────────┘

                            CONFIGURACIÓN JWT:

    application.yml:
    ┌─────────────────────────────────────────────────────────────────────┐
    │ project:                                                            │
    │   jwt:                                                              │
    │     signKey: "WzROun12eUiDvko3UrJ74g..."  # 256-bit key            │
    │     expirationMinutes: 1440                # 24 hours              │
    └─────────────────────────────────────────────────────────────────────┘

                          FLUJO DE AUTORIZACIÓN:

    Request → JwtAuthenticationFilter → Extract JWT → Validate Signature
                                                          │
                                       Valid? ┌──────────┴──────────┐
                                              │ YES              NO │
                                              ▼                     ▼
                                     Set SecurityContext    Return 401
                                              │                     │
                                              ▼                     │
                                     Controller Method              │
                                              │                     │
                                              ▼                     │
                                     Business Logic                 │
                                              │                     │
                                              ▼                     │
                                        JSON Response ◀─────────────┘
```

## Conclusiones

El sistema de gestión hospitalaria desarrollado representa una solución integral que combina tecnologías modernas de desarrollo web con técnicas avanzadas de optimización para resolver problemas complejos de planificación hospitalaria.

### Fortalezas Arquitectónicas

1. **Separación de Responsabilidades**: La arquitectura de tres capas proporciona una base sólida y mantenible
2. **Escalabilidad**: El diseño stateless y modular permite crecimiento futuro
3. **Especialización**: La integración con clingo aprovecha herramientas especializadas para optimización
4. **Experiencia de Usuario**: SPA React proporciona interfaz moderna y responsiva
5. **Despliegue Simplificado**: Single JAR deployment facilita la distribución

### Aspectos Técnicos Destacados

- **Integración Híbrida**: Combina exitosamente Java y Python manteniendo cohesión
- **Optimización Real**: Resuelve problemas NP-hard de planificación con restricciones
- **Flexibilidad de Datos**: Soporte para múltiples bases de datos según el entorno
- **Seguridad Moderna**: JWT stateless apropiado para aplicaciones distribuidas

Este diseño arquitectónico proporciona una base sólida para el sistema actual y permite extensiones futuras como integración móvil, microservicios, y algoritmos de optimización más sofisticados.