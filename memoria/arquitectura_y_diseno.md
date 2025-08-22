# Arquitectura y Diseño del Sistema de Gestión Hospitalaria

## Introducción

El sistema de gestión hospitalaria desarrollado en este Trabajo de Fin de Grado representa una solución integral que combina tecnologías web modernas con técnicas avanzadas de inteligencia artificial para resolver uno de los problemas más complejos del ámbito sanitario: la planificación óptima de turnos y asignaciones de personal médico. 

La complejidad inherente a la programación hospitalaria deriva de la necesidad de satisfacer simultáneamente múltiples restricciones laborales, regulaciones sanitarias, preferencias del personal y requerimientos de cobertura asistencial, todo ello mientras se optimiza la distribución equitativa de la carga de trabajo. Este problema, clasificado matemáticamente como NP-hard, requiere enfoques sofisticados que van más allá de las técnicas tradicionales de programación.

La solución desarrollada adopta una arquitectura híbrida que integra una interfaz web moderna construida con React, un backend robusto basado en Spring Boot, y un subsistema de optimización especializado que utiliza programación lógica con restricciones mediante la herramienta clingo. Esta combinación permite ofrecer una experiencia de usuario fluida mientras se resuelven problemas de optimización complejos que involucran cientos de variables y restricciones interdependientes.

## Arquitectura del Sistema y Comunicación Frontend-Backend

El sistema está fundamentado en una arquitectura de tres capas que separa claramente las responsabilidades y permite la escalabilidad y mantenibilidad del código. La capa de presentación, implementada como una Single Page Application (SPA) con React 18.2.0, se comunica de forma asíncrona con la capa de lógica de negocio a través de una API REST stateless desarrollada con Spring Boot 3.1.3. Esta comunicación se establece mediante el intercambio de mensajes JSON sobre HTTP/HTTPS, siguiendo los principios de arquitectura REST que garantizan la escalabilidad y la interoperabilidad.

La conexión entre el frontend y el backend se establece a través de una serie de servicios especializados que encapsulan las llamadas a la API. En el lado del cliente, cada módulo funcional (planificación, gestión de personal, prioridades) cuenta con servicios JavaScript que utilizan la API Fetch para realizar peticiones HTTP al servidor. Estos servicios implementan el patrón de callback para manejar tanto las respuestas exitosas como los errores, proporcionando una experiencia de usuario robusta incluso ante fallos de red o errores del servidor.

El proceso de comunicación para la generación de planificación ilustra la sofisticación de esta interacción. Cuando un usuario solicita la creación de una planificación anual desde la interfaz React, el componente correspondiente invoca una acción de Redux que, a su vez, ejecuta un servicio que realiza una petición POST al endpoint `/api/plannings/annual`. Esta petición incluye en su cuerpo los parámetros de planificación codificados en JSON, como las restricciones específicas, el personal disponible, y las preferencias de asignación.

El backend recibe esta petición en el PlanningController, que actúa como punto de entrada de la API REST. Este controlador valida los parámetros recibidos y delega la lógica de negocio al PlanningService, que representa la capa de servicios donde se implementa la lógica de negocio compleja. Es en este punto donde se produce una de las características más innovadoras del sistema: la integración con el subsistema de optimización basado en clingo.

## Clingo como Motor de Optimización: El Corazón del Sistema

La característica más distintiva y técnicamente avanzada del sistema es su integración con clingo, un potente solver de Answer Set Programming (ASP) que representa el estado del arte en la resolución de problemas de satisfacción de restricciones complejas. La elección de clingo como motor de optimización no es casual, sino que responde a la naturaleza intrínseca del problema de planificación hospitalaria, que requiere encontrar asignaciones que satisfagan simultáneamente decenas de restricciones interdependientes.

Clingo implementa el paradigma de Answer Set Programming, una forma de programación lógica declarativa especialmente diseñada para problemas de búsqueda y optimización combinatoria. A diferencia de los enfoques algorítmicos tradicionales, donde el programador debe especificar cómo resolver el problema paso a paso, ASP permite describir qué constituye una solución válida mediante un conjunto de reglas lógicas y restricciones. El solver se encarga automáticamente de explorar el espacio de soluciones y encontrar todas las asignaciones que satisfacen las restricciones especificadas.

En el contexto hospitalario, esta capacidad resulta extraordinariamente valiosa. Las restricciones de planificación incluyen regulaciones laborales (como límites en horas de trabajo consecutivas), requisitos de cobertura (garantizar que todas las especialidades estén cubiertas en cada turno), restricciones de competencia (asignar únicamente personal cualificado a cada tarea), y objetivos de optimización (distribuir equitativamente la carga de trabajo). Estas restricciones son frecuentemente conflictivas entre sí, y encontrar un equilibrio óptimo mediante programación tradicional requeriría algoritmos extremadamente complejos y específicos.

Los archivos de reglas lógicas desarrollados para el sistema (yearly.lp, monthly.lp, weekly.lp) contienen la codificación formal de estas restricciones en el lenguaje de ASP. Por ejemplo, la regla `1 {month_assign(P,M,T) : turn(T)} 1:- person(P), month(M)` especifica que cada persona debe estar asignada exactamente a un turno en cada mes, mientras que restricciones como `occup_exact(1,nutrition,1)` establecen que los profesionales de nivel 1 deben cubrir exactamente un mes en el servicio de nutrición. La belleza de este enfoque radica en que el solver clingo puede razonar automáticamente sobre estas restricciones y generar todas las soluciones válidas, ordenándolas según criterios de optimización definidos.

## Python como Intermediario: Bridging Java y Clingo

La integración de clingo en un sistema Java presenta desafíos técnicos interesantes que se resuelven mediante el uso de Python como intermediario. Python fue seleccionado para este papel por varias razones técnicas cruciales: en primer lugar, clingo proporciona bindings nativos muy eficientes para Python, permitiendo un acceso directo y de alto rendimiento al solver. En segundo lugar, Python excede a Java en capacidades de procesamiento de texto y manipulación de archivos, habilidades esenciales para la generación dinámica de archivos de entrada de clingo y el procesamiento de las soluciones resultantes.

La arquitectura de integración funciona mediante un patrón de ejecución de procesos orquestado desde Java. Cuando el PlanningService necesita resolver un problema de optimización, genera dinámicamente un archivo de entrada en formato ASP que contiene los datos específicos de la instancia (personal disponible, restricciones particulares, fechas objetivo). Este archivo se combina con las reglas lógicas predefinidas que codifican las restricciones generales del dominio hospitalario.

El proceso Java ejecuta entonces scripts Python especializados (decode_yearly.py, decode_monthly.py, decode_weekly.py) que cargan tanto las reglas como los datos de entrada en el solver clingo. Estos scripts no solo invocan al solver, sino que también procesan las soluciones resultantes, transformándolas desde el formato interno de ASP a estructuras JSON que pueden ser fácilmente interpretadas por el sistema Java. Esta transformación incluye la ordenación de soluciones según su coste de optimización y la selección de las mejores alternativas para presentar al usuario.

La comunicación entre los procesos Java y Python se establece mediante streams estándar (stdin/stdout) y el intercambio de archivos temporales en el sistema de archivos. Aunque este enfoque introduce cierta complejidad comparado con llamadas directas a bibliotecas, proporciona ventajas significativas en términos de robustez (aislamiento de fallos), mantenibilidad (separación clara de responsabilidades), y flexibilidad (capacidad de actualizar los algoritmos de optimización independientemente del resto del sistema).

## Arquitectura del Frontend: Una Interfaz Moderna para Problemas Complejos

La interfaz de usuario del sistema está construida como una Single Page Application (SPA) utilizando React 18.2.0, una decisión arquitectónica que responde tanto a consideraciones de experiencia de usuario como a requisitos técnicos específicos del dominio hospitalario. Las aplicaciones de planificación hospitalaria requieren interfaces altamente interactivas donde los usuarios puedan visualizar, modificar y comparar diferentes alternativas de planificación sin las interrupciones que provocarían las recargas de página tradicionales.

La arquitectura del frontend se basa en una organización modular por características que refleja los diferentes aspectos funcionales del sistema hospitalario. Esta estructura no solo facilita el desarrollo y mantenimiento del código, sino que también permite la evolución independiente de cada módulo según las necesidades específicas de cada departamento hospitalario. Los módulos principales incluyen la gestión de usuarios, que maneja la autenticación y perfiles del personal médico; la gestión de staff, que permite configurar las competencias y disponibilidad del personal; y el módulo de planificación, que constituye el núcleo funcional de la aplicación.

El módulo de planificación merece especial atención por su complejidad técnica. Implementa tres niveles de planificación (semanal, mensual y anual) que requieren diferentes enfoques de visualización y interacción. El componente WeeklyPlanning presenta una vista tabular detallada que permite la edición granular de asignaciones diarias, mientras que YearlyPlanning ofrece una vista panorámica que facilita la identificación de patrones y desequilibrios en las cargas de trabajo a largo plazo. Cada uno de estos componentes está optimizado para manejar grandes volúmenes de datos (hasta varios miles de asignaciones simultáneas) manteniendo la fluidez de la interfaz.

La gestión del estado de la aplicación se realiza mediante Redux, implementando el patrón unidireccional de flujo de datos que garantiza la predictibilidad y debuggeabilidad del comportamiento de la interfaz. Esta elección es particularmente importante en aplicaciones de planificación, donde múltiples componentes necesitan reaccionar de forma coordinada a cambios en los datos. Cuando el sistema recibe una nueva planificación optimizada desde el backend, Redux se encarga de propagar estos cambios a todos los componentes relevantes, asegurando que la interfaz refleje consistentemente el estado actual de la planificación.

La comunicación asíncrona con el backend se gestiona mediante una capa de servicios que encapsula todas las llamadas a la API REST. Esta capa implementa patrones de manejo de errores sofisticados, incluyendo reintentos automáticos para fallos de red transitorios y mecanismos de fallback que permiten al usuario continuar trabajando incluso cuando algunos servicios no están disponibles temporalmente.

## Arquitectura del Backend: Una Base Sólida para la Complejidad

El backend del sistema se construye sobre Spring Boot 3.1.3, aprovechando la madurez y robustez del ecosistema Spring para proporcionar una API REST escalable y mantenible. La decisión de utilizar Spring Boot responde tanto a consideraciones técnicas como estratégicas: técnicamente, Spring ofrece un contenedor de inversión de dependencias sofisticado que facilita la gestión de la complejidad inherente al sistema; estratégicamente, su amplia adopción en el ámbito empresarial garantiza la disponibilidad de desarrolladores competentes para el mantenimiento futuro del sistema.

La arquitectura del backend implementa el patrón de capas (layered architecture) que separa claramente las responsabilidades entre la presentación de datos, la lógica de negocio, y el acceso a datos. Esta separación no es meramente organizacional, sino que proporciona ventajas concretas en términos de testabilidad, mantenibilidad y escalabilidad. La capa de presentación, compuesta por controladores REST anotados con `@RestController`, se encarga exclusivamente de la recepción de peticiones HTTP, validación básica de parámetros, y serialización de respuestas a JSON. Esta capa delega toda la lógica de negocio a la capa de servicios, garantizando que los controladores permanezcan ligeros y focalizados en sus responsabilidades específicas.

La capa de servicios representa el núcleo intelectual del sistema, donde se implementa la lógica de negocio compleja que caracteriza el dominio hospitalario. El PlanningService, que constituye la pieza central de esta capa, no solo gestiona la coordinación con el subsistema de optimización clingo, sino que también implementa algoritmos de validación, transformación de datos, y post-procesamiento de resultados. Esta capa utiliza el patrón de inyección de dependencias de Spring para acceder a otros servicios (StaffService, PrioritiesService) y a la capa de acceso a datos, manteniendo un bajo acoplamiento que facilita el testing unitario y la evolución independiente de cada componente.

La integración con clingo desde el backend Java merece especial atención por su innovación técnica. Cuando el PlanningService recibe una solicitud de generación de planificación, inicia un proceso complejo que incluye la serialización de los parámetros de entrada al formato ASP, la ejecución de procesos Python externos, y la deserialización de las soluciones resultantes. Este proceso se gestiona de forma robusta, incluyendo mecanismos de timeout para evitar bloqueos indefinidos, validación de la integridad de las soluciones recibidas, y manejo de errores que permite informar al usuario sobre problemas específicos en la generación de planificación.

El intercambio de datos entre el backend y el subsistema de optimización se realiza mediante archivos temporales y comunicación por streams, un enfoque que aunque introduce cierta complejidad operacional, proporciona ventajas significativas en términos de robustez y flexibilidad. Los archivos de entrada generados dinámicamente contienen tanto los datos específicos de la instancia (personal disponible, restricciones particulares) como referencias a las reglas lógicas generales, permitiendo que clingo procese toda la información de forma integrada.

## El Modelo de Restricciones: Codificando la Complejidad Hospitalaria

Una de las contribuciones más significativas del sistema es la formalización de las reglas y restricciones del entorno hospitalario en un modelo matemático procesable por clingo. Esta formalización trasciende la mera automatización de procesos manuales, constituyendo una verdadera ingeniería del conocimiento que captura décadas de experiencia hospitalaria en reglas lógicas precisas.

El modelo de restricciones opera en tres niveles temporales diferentes, cada uno con sus propias complejidades y objetivos de optimización. La planificación anual se enfoca en la distribución equilibrada de cargas de trabajo a largo plazo y la asignación de períodos especializados como rotaciones por servicios específicos. Las restricciones anuales incluyen reglas como `occup_exact(1,nutrition,1)`, que especifica que los residentes de primer año deben pasar exactamente un mes en el servicio de nutrición, o `occup_min(4,blue,3)`, que establece que los profesionales de nivel 4 deben cubrir al menos tres meses en la sección azul (cirugía general).

La planificación mensual introduce restricciones operacionales más detalladas, como la garantía de cobertura diaria mínima, la distribución equitativa de guardias de fin de semana, y el respeto a los períodos de vacaciones. El modelo incluye restricciones como "al menos una persona de comodín debe estar disponible diariamente" y "los residentes R5 no pueden hacer guardias simultáneamente", reflejando requerimientos operacionales específicos del entorno hospitalario.

El nivel semanal permite la validación y refinamiento de asignaciones específicas, implementando restricciones de granularidad fina como límites en horas de trabajo consecutivas, incompatibilidades entre tipos de turnos, y preferencias individuales del personal. Esta estructura jerárquica permite que el sistema mantenga coherencia entre los diferentes niveles temporales mientras optimiza según criterios específicos de cada horizonte de planificación.

## Persistencia y Gestión de Datos

El sistema utiliza una aproximación híbrida para la persistencia de datos que combina una base de datos relacional tradicional para datos maestros y archivos JSON para resultados de optimización. Esta decisión arquitectónica responde a las características específicas de los diferentes tipos de datos que maneja el sistema.

Los datos maestros (personal médico, configuración de prioridades, parámetros de restricciones) se almacenan en una base de datos relacional utilizando JPA/Hibernate, aprovechando las garantías ACID para asegurar la consistencia e integridad de esta información crítica. El modelo de datos es deliberadamente simple, con entidades como Staff, Priority, y ActivityAndPlanning, que capturan la información esencial sin introducir complejidad innecesaria.

Los resultados de optimización, por el contrario, se persisten como archivos JSON estructurados que mantienen la rica semántica de las soluciones generadas por clingo. Esta aproximación permite preservar metadatos importantes como costes de optimización, alternativas de solución, y criterios de ordenación, información que sería difícil de modelar eficientemente en un esquema relacional tradicional.

## Seguridad y Autenticación

La seguridad del sistema se fundamenta en JSON Web Tokens (JWT), implementando un modelo de autenticación stateless que resulta apropiado tanto para la arquitectura de microservicios como para el eventual escalado horizontal del sistema. La elección de JWT sobre sesiones tradicionales responde a consideraciones tanto técnicas como operacionales: técnicamente, los tokens stateless eliminan la necesidad de almacenamiento de sesión en el servidor, simplificando el despliegue y la escalabilidad; operacionalmente, permiten la implementación futura de características como single sign-on (SSO) con otros sistemas hospitalarios.

El mecanismo de autenticación integra Spring Security con filtros personalizados que interceptan las peticiones HTTP, validan los tokens JWT, y establecen el contexto de seguridad apropiado. Este diseño permite una granularidad fina en el control de acceso, donde diferentes endpoints pueden requerir diferentes roles o permisos, adaptándose a la estructura jerárquica típica de las organizaciones hospitalarias.

## Integración y Despliegue del Sistema

Una característica distintiva del sistema es su enfoque unificado de construcción y despliegue, que combina el frontend React y el backend Spring Boot en un único artefacto JAR ejecutable. Esta decisión arquitectónica simplifica significativamente el proceso de despliegue en entornos hospitalarios, donde la complejidad operacional debe minimizarse debido a las limitaciones de recursos de IT típicas de estas organizaciones.

El pipeline de construcción utiliza Maven como orquestador principal, integrado con frontend-maven-plugin para gestionar automáticamente la instalación de Node.js, la resolución de dependencias del frontend, y la construcción de los assets estáticos. Este proceso genera automáticamente los bundles optimizados del frontend (incluyendo minificación, tree-shaking, y code-splitting) y los integra en el JAR final como recursos estáticos servidos por el contenedor Tomcat embebido.

La flexibilidad en la configuración de base de datos permite al sistema adaptarse a diferentes entornos sin recompilación: utiliza H2 en memoria para desarrollo y testing rápido, mientras que se configura con MariaDB para entornos de producción. Esta dualidad se gestiona mediante perfiles de Spring y configuración externalizada, permitiendo que el mismo artefacto ejecutable funcione en diferentes entornos simplemente cambiando parámetros de línea de comandos.

## Justificación de las Decisiones Arquitectónicas

Las decisiones arquitectónicas adoptadas en el sistema responden a un cuidadoso análisis de los requisitos específicos del dominio hospitalario y las limitaciones técnicas y organizacionales típicas de estos entornos. La adopción de una arquitectura híbrida Java-Python, aunque introduce complejidad adicional, está justificada por la superioridad técnica de clingo para resolver problemas de optimización combinatoria comparado con implementaciones nativas en Java.

La elección de React para el frontend se fundamenta en su capacidad para manejar interfaces altamente interactivas con grandes volúmenes de datos, requisito esencial para las aplicaciones de planificación donde los usuarios necesitan visualizar y editar simultáneamente cientos de asignaciones. El patrón Redux, aunque introduce complejidad conceptual, proporciona la predictibilidad necesaria para manejar las complejas interacciones entre múltiples niveles de planificación.

La arquitectura stateless del backend, centrada en JWT y API REST, facilita no solo la escalabilidad horizontal futura sino también la integración con otros sistemas hospitalarios existentes. Esta decisión anticipa las necesidades de interoperabilidad típicas de los entornos sanitarios, donde múltiples sistemas especializados deben coexistir e intercambiar información.

## Diagramas de Arquitectura para Draw.io

### Diagrama 1: Arquitectura General del Sistema

**Instrucciones para Draw.io:**
Crear un diagrama de tres capas principales con los siguientes elementos y conexiones:

**Elementos a crear:**
- Rectángulo "CAPA DE PRESENTACIÓN" conteniendo:
  - Rectángulo "React Frontend" con módulos: Planning, Users, Staff, Priorities
  - Rectángulo "Redux Store" con: App State, Users State, Planning State, Staff State, Priority State
- Rectángulo "CAPA DE LÓGICA DE NEGOCIO" conteniendo:
  - Rectángulo "Spring Boot Backend" con:
    - Sub-rectángulo "REST Controllers": PlanningController, UserController, StaffController, PrioritiesController
    - Sub-rectángulo "Services Layer": PlanningService, UserService, StaffService, PrioritiesService
    - Sub-rectángulo "JPA Entities": Staff Entity, Priority Entity, User Entity, ActivityAndPlanning Entity
- Rectángulo "CAPA DE DATOS" conteniendo:
  - Rectángulo "Database" con tablas: STAFF, PRIORITY, ACTIVITY_PLANNING
  - Nota: "MariaDB (Production) / H2 Database (Development)"
- Rectángulo "SUBSISTEMA DE OPTIMIZACIÓN" conteniendo:
  - Rectángulo "Python Clingo" con:
    - Scripts: decode_yearly.py, decode_monthly.py, decode_weekly.py
    - Archivos: yearly.lp, monthly.lp, weekly.lp
    - "CLINGO SOLVER ENGINE (Answer Set Programming)"

**Conexiones:**
- "CAPA DE PRESENTACIÓN" → "CAPA DE LÓGICA DE NEGOCIO" (etiqueta: "HTTP/JSON REST API")
- "CAPA DE LÓGICA DE NEGOCIO" → "CAPA DE DATOS" (etiqueta: "JPA/Hibernate SQL")
- "CAPA DE LÓGICA DE NEGOCIO" → "SUBSISTEMA DE OPTIMIZACIÓN" (etiqueta: "Process Execution JSON Files")

### Diagrama 2: Flujo de Generación de Planificación

**Instrucciones para Draw.io:**
Crear un diagrama de flujo vertical con los siguientes elementos conectados por flechas:

**Secuencia de elementos (de arriba hacia abajo):**
1. "USUARIO WEB (Frontend)" 
2. "FRONTEND (PlanningModule)" - etiqueta conexión: "1. Solicita generar planificación"
3. "PlanningController (@RestController)" - etiqueta: "2. HTTP POST /api/plannings/generateMonthly"
4. "PlanningService (@Service)" - etiqueta: "3. Valida request, obtiene datos"
5. "FILE SYSTEM (input_monthly.lp)" - etiqueta: "4. Genera archivo con constraints"
6. "PYTHON SCRIPT (decode_monthly.py)" - etiqueta: "5. Ejecuta python3 decode_monthly.py"
7. "CLINGO SOLVER (ASP Engine)" - etiqueta: "6. Resuelve constraints, encuentra modelo óptimo"
8. "FILE SYSTEM (solutionMonthly.json)" - etiqueta: "7. Genera JSON estructurado"
9. "DATABASE (JPA/Hibernate)" - etiqueta: "8. Persiste planificación"
10. "FRONTEND (Redux Store)" - etiqueta: "9. Retorna resultado, actualiza UI"

**Datos de ejemplo en cajas laterales:**
- Input: `{ year: 2024, month: "ENERO", staff: [...], priorities: [...] }`
- LP: `staff("Juan Pérez", "R1"). priority("guardia", 5).`
- Output: `assignment("Juan Pérez", 1, "G").`
- JSON: `{ "Juan Pérez": { "1": "G", "2": "-" } }`

### Diagrama 3: Arquitectura de Seguridad JWT

**Instrucciones para Draw.io:**
Crear un diagrama de intercambio de mensajes entre dos columnas:

**Columna Izquierda: "USUARIO WEB (Browser)"**
**Columna Derecha: "BACKEND API (Spring Boot)"**

**Secuencia de mensajes (con flechas horizontales):**
1. Usuario → Backend: "POST /api/users/login {username, password}"
2. Backend → Usuario: "Response: {serviceToken: '<JWT>'}"
3. Usuario interno: "Store JWT in sessionStorage"
4. Usuario → Backend: "HTTP Request Authorization: Bearer <JWT>"
5. Backend interno: "JWT Filter validates → SecurityContext"
6. Backend → Usuario: "Response (if authorized)"

**Componentes adicionales:**
- Rectángulo "SPRING SECURITY CHAIN" conteniendo:
  - "CORS Filter" → "JWT Auth Filter" → "Authorization Manager"
  - "BCrypt PasswordEncoder", "JWT Generator", "SecurityContext Holder"

**Configuración JWT:**
- Caja "application.yml" con texto: `project.jwt.signKey: "..." expirationMinutes: 1440`

## Conclusiones y Contribuciones del Sistema

El sistema desarrollado representa una contribución significativa al campo de la automatización hospitalaria, no solo por su funcionalidad práctica sino por la innovación en su diseño arquitectónico. La integración exitosa de tecnologías web modernas con técnicas avanzadas de inteligencia artificial demuestra la viabilidad de aplicar Answer Set Programming a problemas reales de optimización en entornos críticos como los hospitalarios.

La principal fortaleza del sistema radica en su capacidad para transformar un problema inherentemente complejo (la planificación óptima de recursos hospitalarios) en una solución accesible y usable por personal no técnico. La interfaz intuitiva construida con React permite que los coordinadores hospitalarios interactúen naturalmente con algoritmos sofisticados de optimización, democratizando el acceso a herramientas de planificación avanzada que tradicionalmente requerían conocimientos especializados en investigación operativa.

Desde el punto de vista técnico, el sistema aporta una arquitectura híbrida novedosa que demuestra cómo integrar efectivamente solvers especializados en sistemas de información empresariales. La separación clara entre la lógica de dominio hospitalario (codificada en reglas ASP) y la infraestructura tecnológica (Java/React) permite que el sistema evolucione independientemente en ambas dimensiones: las reglas de planificación pueden refinarse sin modificar el código de aplicación, y la infraestructura tecnológica puede actualizarse sin alterar la lógica de optimización.

El enfoque de despliegue unificado, que combina frontend y backend en un único artefacto ejecutable, responde específicamente a las limitaciones operacionales de los entornos hospitalarios, donde la simplicidad de despliegue y mantenimiento es crucial. Esta decisión arquitectónica facilita la adopción del sistema en organizaciones con recursos IT limitados, características típicas de muchas instituciones sanitarias.

La escalabilidad del diseño permite extensiones futuras importantes, como la incorporación de algoritmos de machine learning para predecir patrones de demanda, la integración con sistemas de gestión hospitalaria existentes mediante APIs estándar, o la expansión a planificación de recursos adicionales como quirófanos, equipos médicos, o personal de enfermería. El framework de restricciones basado en ASP facilita estas extensiones, ya que nuevos requisitos pueden incorporarse como reglas lógicas adicionales sin reestructurar el sistema completo.

En términos de impacto organizacional, el sistema contribuye a la transformación digital de los procesos hospitalarios, proporcionando una base tecnológica sólida para la optimización de recursos que puede traducirse en mejoras tangibles en la eficiencia operacional y, en última instancia, en la calidad de la atención sanitaria proporcionada a los pacientes.