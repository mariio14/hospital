% Planificacion mensual

%task(g;gp;e;i;c).
task(g,2).
task(e,1).
task(i,1).
task(c,1).

guard(g;gp).

%Comentar estas lineas si se ejecuta con input.lp
day(1..30).
weekend(1;2;3;15;16;17).
festivo(7;28).
person(1..15).
holiday(1,4). % Person, day
holiday(1,5).
holiday(13,29).
holiday(13,30).
level(P,(P-1)/3 + 1) :- person(P).
day_assign(1,4,gp).
day_assign(1,13,gp).
day_assign(1,24,gp).
day_assign(2,7,gp).
day_assign(2,11,gp).
day_assign(2,22,gp).

N {day_assign(P,D,T) : person(P), not holiday(P,D)} N :- task(T, N), day(D).
% Alternativa: (probar ambas)
% N {day_assign(P,D,T) : person(P)} N :- task(T, N), day(D).
% :- holiday(P,D), day_assign(P,D,_).

:- day_assign(P,D,T), day_assign(P,D,T'), T!=T'.

%:- day(D), #count{P:day_assign(P,D,g)}!=2.

:- person(P), guard(G), #count{D:day_assign(P,D,G)}<4.
:- person(P), guard(G), #count{D:day_assign(P,D,G)}>6.

:- guard(G), day_assign(P,D,G), day_assign(P,D+1,G).

:- level(P,1), level(P',1), day_assign(P,D,g), day_assign(P',D,g), P!=P'.

:- day(D), not day_assign(_,D,e). % meter dias habiles?
:- day(D), not day_assign(_,D,i). % meter dias habiles?
:- day(D), not day_assign(_,D,c).

#show day_assign/3.


% predicado weekend marcado por viernes
% por cada finde y cada tarea minimizar el n de personas asignadas