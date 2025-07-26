% Planificacion semanal

% Comentar estas lineas si se ejecuta con input.lp
%day(1..5).
%person(1..15).
%level(P,(P-1)/3 + 1) :- person(P).

task_color(qx, yellow, 7, 1).
task_color(qx, blue, 8, 2).
task_color(qx, blue, 9, 2).
task_color(qx, red, 9, 2).
task_color(qx, red, 11, 2).

task_evening_color(qx, blue, 8, 1).
task_evening(consultation, 9).

task(consultation, 10).
task(consultation, 11).
task(carca, 10).
task(carca, 11).
task(cerdo, 7).
task(cerdo, 8).
task(qxrobot, 8).
task(qxrobot, 10).

% meter dummys de actividades
day_not_assign(1,1,qx).

cost(semanalP_03_4_5, yellow, 10).
cost(semanalP_03_4_5, red, 20).
cost(semanalP_03_4_5, blue, 50).
cost(semanalP_10, 25).
cost(semanalP_11, 15).
cost(semanalP_12, 30).
cost(semanalP_15, 25).

color(yellow;red;blue).

% SemanalR_01
N {day_assign(P,D,qx,C,morning) : person(P), not vacation(P,D), month_assign(P,C), not day_not_assign(P,D,qx)} :- task_color(qx, C, D, N).
N {day_assign(P,D,qx,C,evening) : person(P), not vacation(P,D), month_assign(P,C), not day_not_assign(P,D,qx)} :- task_evening_color(qx, C, D, N).

% SemanalR_06, SemanalR_07, SemanalR_08
1 {day_assign(P,D,consultation,null,morning) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,consultation)} 1 :- task(consultation, D).
1 {day_assign(P,D,consultation,null,evening) : person(P), level(P,L), L>3, not vacation(P,D), not day_not_assign(P,D,consultation)} 1 :- task_evening(consultation, D).
1 {day_assign(P,D,carca,null,morning) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,carca)} 1 :- task(carca, D).

2 {day_assign(P,D,cerdo,null,morning) : person(P), not vacation(P,D), not day_not_assign(P,D,cerdo)} 2 :- task(cerdo, D).

% Restriccion nivel cerdo
:- task(cerdo, D), not 1{day_assign(P,D,cerdo,null,morning) : person(P), level(P,L), L>2}.

% SemanalR_13, SemanalR_14
1 {day_assign(P,D,qxrobot,null,morning) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,qxrobot)} 1 :- task(qxrobot, D).

% SemanalR_02
{day_assign(P,D,floor,C,morning) : person(P), not vacation(P,D), month_assign(P,C), not day_not_assign(P,D,floor)} :- day(D), color(C).
%%%%%%%%%%5falta lo de la planta amarilla
% SemanalR_09
:- day_assign(P,D,A,C,evening), day_assign_from_month(P,D,_).

% SemanalR_XX
:- day_assign(P,D,T,C,morning), day_assign(P,D,T',C',morning),
    (T,C) < (T',C'), (T,C)!=(floor,yellow), (T',C')!=(floor,yellow).

% SemanalR_XX
:- day_assign(P,D,T,C,evening), day_assign(P,D,T',C',evening), (T,C) < (T',C').

% SemanalP_03, SemanalP_04, SemanalP_05
color_floor_assigned(C,D) :- day_assign(P,D,floor,C,M), person(P), month_assign(P,C).
#minimize { V,C,D :
    day(D), not color_floor_assigned(C,D),
    cost(semanalP_03_4_5, C,V)
}.

% SemanalP_10  -> se cambia a restriccion
%:- day_assign(P,D,A,C,evening), prev_day(D,D'), day_assign_guard_from_month(P,D').

% SemanalP_11
#minimize { V,P,D :
    day_assign(P,D,A,C,evening), level(P,3),
    cost(semanalP_11, V)
}.

% SemanalP_12
#minimize { V,P,D :
    day_assign(P,D,A,C,evening), level(P,L), L<3,
    cost(semanalP_12, V)
}.

% SemanalP_15
#minimize { V,P,D :
    day_assign(P,D,qxrobot,C,M), level(P,5),
    cost(semanalP_15, V)
}.


%#show month_assign/2.
%#show day_assign_from_month/3.
#show day_assign/5.

% residente de procto siempre en procto. que significa?
