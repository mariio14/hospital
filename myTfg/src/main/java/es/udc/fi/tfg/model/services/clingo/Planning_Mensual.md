## Planning Mensual

Tareas:
 - **G**: guardia
 - **GP**: guardia de puerta (urgencias)
    - **NO LA GENERAMOS NOSOTROS. ES UN INPUT**
 - **E**: extración
 - **I**: implante
 - **C**: comodín

Inputs y otras cosas:
    - El calendario específico de ese mes (nº días, y días de la semana)
    - Festivos? (creo que no influye)
    - Vacaciones de los residentes

* *MensualR_C1*: al menos una persona de comodín diariamente, para los casos que haya dos trasplantes.

* *MensualR_V1*: si está de vacaciones no se le pone nada

## Guardias presenciales: G (de cirugía) y GP de (urgencias/puerta)

- *MensualR_G1*: Cada día hábil (L-V) del mes debe de estar exactamente 2* residentes asignados a **G**. (nº residentes = 2, podría ser una preferencia)
- *MensualR_G2*: No puede ser que el mismo residente esté asignado a dos tareas el mismo día.
- *MensualP_G3*: Repartir equitativamente las guardias del mes (intentar aproximarse a 5 cada uno)
- *MensualR_G4*: R1 tienen 3 GPs
- *MensualR_G5*: Mismo residente GPs + G < 6
- *MensualR_G6*: No se puede estar de guardia (G/GP) dos días consecutivos
- *MensualP_G7*: Preferible no asignar ninguna tarea después de una guardia (G/GP)
- *MensualR_G8*: No asignar las dos G de un mismo día a dos R1
- *MensualP_G9*: **Muy** Preferible que la guardia la compartan un R{5,4,3} (mayor) y un R{2,1} (pequeño)

Pequeña excepción que menciona Tesi:
```text
Los R2 hacen guarida "de mayor" (es decir con un R1, R2 o solos) solo en situaciones muy concretas (navidad, año nuevo, san juan, ...)
```
Lo lógico en este caso parece no implementar ninguna preferencia y que ellos lo controlen interactivamente antes de generar el planning.

- *MensualP_G10*: para cada fin de semana, minimizar la cantidad de residentes que tienen alguna guardia

* *Fin de semana de guardia presencial*: tener al menos una G/GP en ese finde
* *Fin de semana localizad@*: tener todo el finde o bien **E** o bien **I**.

- *MensualP_G11*: suelen poner 1 finde presencial + 1 finde localizad@ a cada 1 (esto lo dejamos para el final)

- *MensualP_G12*: preferible nº finde presenciales o localizados < 2 por persona. (coste de 3 argumntos, por tipo de tarea)

- *MensualP_G13*: (cuidadín con esta en términos de esfuerzo computacional) repartir las tareas (G, GP, E, I) a lo largo del mes para la misma persona
    - dicho de otra forma: no poner todo junto al principio o al final

## Guardias Localizadas: E (extracciones) e I (implantes)

Cada día hábil (L-V) del mes debe de estar (al menos) un residente asignado a **E** y **I**. (en el ejemplo no pasa, posible caso de ignorar)

* *MensualR_L1*: R1 no pueden hacer **I** los dos primeros meses
* *MensualR_L2*: **E** solo R{5,4,3}
* *MensualP_L3*: equilibrar total de **E** e **I** entre los residentes
* *MensualP_L4*: evitar **I** inmediatamente antes de **G/GP**
* *MensualP_L5*: equilibrar nº total de localizad@s por persona (preferible que pringue el pequeño R{2,1})