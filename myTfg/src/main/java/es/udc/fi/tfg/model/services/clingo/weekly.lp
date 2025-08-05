% Planificacion semanal

% Comentar estas lineas si se ejecuta con input.lp
%day(7..11).
%person(1..15).
%level(P,(P-1)/3 + 1) :- person(P).

%task_color(qx, yellow, 7, 1).
%task_color(qx, blue, 8, 2).
%task_color(qx, blue, 9, 2).
%task_color(qx, red, 9, 2).
%task_color(qx, red, 11, 2).

%task_evening_color(qx, blue, 8).
%task_evening(consultation, 9).

%task(consultation, 10).
%task(consultation, 11).
%task(carca, 10).
%task(carca, 11).
%task(cerdo, 7).
%task(cerdo, 8).
%task(qxrobot, 8).
%task(qxrobot, 10).

% dummys to avoid warnings
day_not_assign(1,1,qx).
task(dummy, dummy).
task_color(dummy, dummy, dummy, dummy).
task_evening(dummy, dummy).
task_evening_color(dummy, dummy, dummy).

cost(semanalP_03_4_5, yellow, 10).
cost(semanalP_03_4_5, red, 20).
cost(semanalP_03_4_5, blue, 50).
cost(semanalP_14, 15).
cost(semanalP_21, 25).

% SemanalR_01
N {day_assign(P,D,qx,C,morning) : person(P), not vacation(P,D), month_assign(P,C), not day_not_assign(P,D,qx)} N :- task_color(qx, C, D, N).
% SemanalR_13,
1 {day_assign(P,D,qx,C,evening) : person(P), level(P,L), L>1, not vacation(P,D), month_assign(P,C), not day_not_assign(P,D,qx)} 1 :- task_evening_color(qx, C, D).

% SemanalR_06, SemanalR_07
1 {day_assign(P,D,consultation,null,morning) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,consultation)} 1 :- task(consultation, D), day(D).
% SemanalR_08
1 {day_assign(P,D,consultation,null,evening) : person(P), level(P,L), L>3, not vacation(P,D), not day_not_assign(P,D,consultation)} 1 :- task_evening(consultation, D).
% SemanalR_09, SemanalR_10
1 {day_assign(P,D,carca,null,morning) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,carca)} 1 :- task(carca, D).

% SemanalR_11
2 {day_assign(P,D,cerdo,null,morning) : person(P), not vacation(P,D), not day_not_assign(P,D,cerdo)} 2 :- task(cerdo, D).

% SemanalR_12
%:- task(cerdo, D), not 1{day_assign(P,D,cerdo,null,morning) : person(P), level(P,L), L>2}.
:- task(cerdo, D), not day_assign(P,D,cerdo,null,morning): level(P,L), L>2.

% SemanalR_19, SemanalR_20
1 {day_assign(P,D,qxrobot,null,morning) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,qxrobot)} 1 :- task(qxrobot, D).

% SemanalR_02
{day_assign(P,D,floor,C,morning) : person(P), not vacation(P,D), month_assign(P,C), not day_not_assign(P,D,floor)} :- task_color(floor,C,D,_).
%%%%%%%%%%%falta lo de la planta amarilla

% SemanalR_15, SemanalR_16
:- day_assign(P,D,T,C,DM), day_assign(P,D,T',C',DM),
    (T,C) < (T',C'), (T,C)!=(floor,yellow), (T',C')!=(floor,yellow).

% SemanalP_03, SemanalP_04, SemanalP_05
color_floor_assigned(C,D) :- day_assign(P,D,floor,C,M), person(P), month_assign(P,C).
#minimize { V,C,D :
    day(D), not color_floor_assigned(C,D),   % IDEA: cambiar por conditional literal
    cost(semanalP_03_4_5, C,V)
}.

% SemanalP_14
#minimize { V,P,D :
    day_assign(P,D,qx,C,evening), level(P,L), L>4,
    cost(semanalP_14, V)
}.

% SemanalR_17
:- day_assign(P,D,A,C,evening), day_assign_guard_from_month(P,D).
:- day_assign(P,D,A,C,evening), day_assign_from_month(P,D,e).
:- day_assign(P,D,A,C,evening), day_assign_from_month(P,D,i).
% SemanalR_18
:- day_assign(P,D,A,C,evening), prev_day(D,D'), day_assign_guard_from_month(P,D').

% SemanalP_21
#minimize { V,P,D :
    day_assign(P,D,qxrobot,C,M), level(P,5),
    cost(semanalP_21, V)
}.

%#show month_assign/2.
%#show day_assign_from_month/3.
#show day_assign/5.
