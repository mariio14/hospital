% Planificacion semanal

% Comentar estas lineas si se ejecuta con input.lp
%day(1..5).
%person(1..15).
%level(P,(P-1)/3 + 1) :- person(P).

task_color(qx, yellow, 7).
task_color(qx, blue, 8).
task_color(qx, blue, 9).
task_color(qx, red, 9).
task_color(qx, red, 11).
task_color(floor, yellow, 7).
task_color(floor, red, 8).
task_color(floor, blue, 9).

task(consultation, 10).
task(consultation, 11).
task(peonage, 9).
task(peonage, 8).
task(qxrobot, 8).
task(qxrobot, 10).

vacation(dummyname,1).
day_not_assign(1,1,qx).

cost(semanalP_03_4_5, yellow, 10).
cost(semanalP_03_4_5, red, 20).
cost(semanalP_03_4_5, blue, 50).
cost(semanalP_10, 25).
cost(semanalP_11, 15).
cost(semanalP_12, 30).
cost(semanalP_15, 25).

% SemanalR_01
1 {day_assign(P,D,qx) : person(P), not vacation(P,D), month_assign(P,C), not day_not_assign(P,D,qx)} :- task_color(qx, C, D).

% SemanalR_02
{day_assign(P,D,floor) : person(P), not vacation(P,D), month_assign(P,C), not day_not_assign(P,D,floor)} :- task_color(floor, C, D).

% SemanalR_06, SemanalR_07, SemanalR_08
1 {day_assign(P,D,consultation) : person(P), level(P,L), L<4, not vacation(P,D), not day_not_assign(P,D,consultation)} 1 :- task(consultation, D).
1 {day_assign(P,D,peonage) : person(P), not vacation(P,D), not day_not_assign(P,D,peonage)} 1 :- task(peonage, D).

% SemanalR_13, SemanalR_14
1 {day_assign(P,D,qxrobot) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,qxrobot)} 1 :- task(qxrobot, D).

% SemanalR_09
:- day_assign(P,D,peonage), day_assign_from_month(P,D,_).

% SemanalP_03, SemanalP_04, SemanalP_05
color_floor_assigned(C,D) :- day_assign(P,D,floor), person(P), month_assign(P,C).
#minimize { V,C,D :
    task_color(floor,C,D), not color_floor_assigned(C,D),
    cost(semanalP_03_4_5, C,V)
}.

% SemanalP_10
#minimize { V,D :
    day_assign(P,D,peonage), prev_day(D,D'), day_assign_guard_from_month(P,D'),
    cost(semanalP_10, V)
}.

% SemanalP_11
#minimize { V,P,D :
    day_assign(P,D,peonage), level(P,3),
    cost(semanalP_11, V)
}.

% SemanalP_12
#minimize { V,P,D :
    day_assign(P,D,peonage), level(P,L), L<3,
    cost(semanalP_12, V)
}.

% SemanalP_15
#minimize { V,P,D :
    day_assign(P,D,qxrobot), level(P,5),
    cost(semanalP_15, V)
}.


#show month_assign/2.
%#show day_assign_from_month/3.
#show day_assign/3.

% residente de procto siempre en procto. que significa?
% penalizar mas gente que 1 en qx y planta?
