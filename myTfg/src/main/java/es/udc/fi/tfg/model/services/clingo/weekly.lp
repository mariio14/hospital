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

task(consultation, 10).
task(consultation, 11).
task(peonage, 9).
task(peonage, 8).
task(qxrobot, 8).
task(qxrobot, 10).

vacation(dummyname,1).
day_not_assign(1,1,qx).

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







#show month_assign/2.
%#show day_assign_from_month/3.
#show day_assign/3.

% residente de procto siempre en procto. que significa?
% penalizar mas gente que 1 en qx y planta?

% P03, P04, P05, P10, P11, P12, P15