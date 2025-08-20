# Hospital Management System - TFG

Hospital management system is a Spring Boot 3.1.3 backend with React 18.2.0 frontend that includes constraint-based planning optimization using Python clingo. The system uses Maven for build orchestration with integrated frontend build pipeline.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Build Commands
Run commands in this exact order from the `/myTfg` directory:

- Install Python dependencies: `pip3 install clingo`
- **NEVER CANCEL**: Build takes 45 seconds. Set timeout to 90+ seconds: `mvn clean compile`
- **NEVER CANCEL**: Full package build takes 45 seconds. Set timeout to 90+ seconds: `mvn clean package -DskipTests=true`
- **NEVER CANCEL**: Run backend tests (requires MariaDB setup): `mvn clean test` - takes 30 seconds. Set timeout to 60+ seconds.

### Run the Application

#### Production Mode (Complete Application)
- **ALWAYS** build first using the commands above
- Run with H2 database: `java -jar target/myTfg-0.1-SNAPSHOT.jar --spring.datasource.url=jdbc:h2:mem:testdb --spring.datasource.driver-class-name=org.h2.Driver --spring.datasource.username=sa --spring.datasource.password= --spring.jpa.database-platform=org.hibernate.dialect.H2Dialect --spring.sql.init.mode=never --spring.jpa.hibernate.ddl-auto=create`
- Application runs on: `http://localhost:8080/mytfg/`
- Test users: `test/test` or `admin/test` (password: `test`)

#### Development Mode (Frontend Only)
- Navigate to frontend directory: `cd myTfg/frontend`
- Start development server: `yarn start`
- Frontend runs on: `http://localhost:3000/`
- Proxy configuration points to `http://localhost:8080/` for API calls

### Database Configuration
- **Production**: MariaDB (requires localhost:3306 setup)
- **Development**: H2 in-memory database (use command-line overrides above)
- **Schema**: Auto-created by Hibernate or via `src/main/resources/schema.sql`
- **Test data**: Default admin/test users created automatically

## Validation

### Manual Testing Requirements
- **ALWAYS** test the complete login flow after making authentication changes
- **CRITICAL**: Test planning optimization by accessing planning modules and generating schedules
- **ALWAYS** verify Python clingo integration works by testing constraint solving features
- **ALWAYS** run through at least one complete user workflow: login → navigate modules → create/view data

### Build Validation Steps
- **ALWAYS** run the full Maven build before committing changes
- **ESLint warnings**: Suppressed via ESLINT_NO_DEV_ERRORS=true in pom.xml configuration
- **Tests**: Backend tests require MariaDB. Use `-DskipTests=true` for quick builds
- **Frontend**: Automatically built and bundled into JAR during Maven package phase

### Python Integration Testing
- Verify clingo is installed: `python3 -c "import clingo; print('OK')"`
- Test planning scripts: `cd myTfg/src/main/java/es/udc/fi/tfg/model/services/clingo && python3 decode_yearly.py yearly.lp`
- Scripts should run without errors (informational messages about unused atoms are normal)

## Common Tasks

### Timeout Settings for All Commands
- **NEVER CANCEL builds or long-running commands**
- Maven compile: 90+ seconds timeout
- Maven package: 90+ seconds timeout  
- Maven test: 60+ seconds timeout
- Application startup: 30+ seconds timeout
- Frontend yarn commands: 60+ seconds timeout

### Development Workflow
1. Make code changes
2. Run `mvn clean compile` - NEVER CANCEL, wait 45 seconds
3. Test with `java -jar` command above (see "Run the Application")
4. For frontend changes: `cd frontend && yarn start`
5. **ALWAYS** manually test the affected functionality
6. **ALWAYS** run full build before committing: `mvn clean package -DskipTests=true`

### Key Project Structure
```
myTfg/
├── src/main/java/es/udc/fi/tfg/
│   ├── Application.java (Spring Boot main)
│   ├── rest/ (REST controllers and DTOs)
│   ├── model/ (JPA entities and services)
│   └── model/services/clingo/ (Python constraint scripts)
├── src/main/resources/
│   ├── application.yml (Spring configuration)
│   └── schema.sql (Database schema)
├── frontend/ (React application)
│   ├── src/modules/ (React components by feature)
│   ├── package.json (NPM dependencies)
│   └── public/ (Static assets)
├── pom.xml (Maven configuration)
└── target/myTfg-0.1-SNAPSHOT.jar (Built application)
```

### Technology Stack Reference
- **Backend**: Spring Boot 3.1.3, Java 17, JWT authentication, JPA/Hibernate
- **Frontend**: React 18.2.0, Redux, Bootstrap 5.3.3, React Router
- **Build**: Maven with frontend-maven-plugin (Node.js v18.12.0, Yarn v1.22.19)
- **Database**: MariaDB (production), H2 (development)
- **Planning**: Python 3 + clingo library for constraint logic programming
- **Deployment**: Single JAR with embedded Tomcat and static frontend assets

## Critical Warnings

- **NEVER CANCEL** any Maven command - builds can take up to 45 seconds
- **ALWAYS** install Python clingo before testing planning features: `pip3 install clingo`  
- **ALWAYS** use H2 database overrides for local development (see run commands above)
- **ALWAYS** set appropriate timeouts (90+ seconds for builds, 60+ for tests)
- **ALWAYS** validate changes by running the complete application and testing user workflows
- **Tests require MariaDB setup** - use `-DskipTests=true` for quick builds
- **Frontend build warnings** are suppressed and non-blocking but should be addressed in production