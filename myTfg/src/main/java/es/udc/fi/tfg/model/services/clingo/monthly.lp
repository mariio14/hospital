% Planificacion mensual

task(g;gp;e;i;c).
guard(g;gp).

%Comentar estas lineas si se ejecuta con input.lp
day(1..30).
weekend(1;2;3;15;16;17).
festivo(7;28).
person(1..15).
holiday(1,4). % Persona, dia
holiday(1,5).
holiday(13,29).
holiday(13,30).
level(P,(P-1)/3 + 1) :- person(P).

0 {day_assign(P,D,T) : task(T)} 1:- person(P), day(D).

:- person(P), holiday(P,D), day_assign(P,D,_).

:- day(D), #count{P:day_assign(P,D,g)}!=2.

:- person(P), task(G), guard(G) #count{D:day_assign(P,D,G)}<4.
:- person(P), task(G), guard(G) #count{D:day_assign(P,D,G)}>6.

:- person(P), guard(G), day_assign(P,D,G), day_assign(P,D+1,G).
:- person(P), person(P'), level(P,1), level(P',1), day(D),
     day_assign(P,D,g), day_assign(P',D,g).

:- day(D), not day_assign(_,D,e). % meter dias habiles?
:- day(D), not day_assign(_,D,i). % meter dias habiles?
:- day(D), not day_assign(_,D,c).

#show day_assign/3.