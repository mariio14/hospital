% Planificacion semanal

% dummys to avoid warnings
day_not_assign(1,1,qx).
task(dummy, dummy).
task_color(dummy, dummy, dummy, dummy, dummy).
task_color(dummy, dummy, dummy, dummy).
task_evening(dummy, dummy).
task_evening_color(dummy, dummy, dummy, dummy).

day_assign(dummyname, dummy, dummy, dummy, dummy, dummy).

cost(semanalP_22, 1).
cost(semanalP_23, 2).
cost(semanalP_24, 1).
cost(semanalP_25, 2).
cost(semanalP_26, 1).
cost(semanalP_27, 1).
cost(semanalP_28, 1).
cost(semanalP_29, 1).

% SemanalR_01
:- day_assign(P,D,T,C,MT,I), vacation(P,D).
:- day_assign(P,D,T,C,MT,I), day_not_assign(P,D,T).
:- task_color(qx, C, D, N, I), Cnt = #count { P : day_assign(P,D,qx,C,morning,I) }, Cnt < N.

% SemanalR_13
:- task_evening_color(qx, C, D, I), day_assign(P,D,qx,C,evening,I), level(P,L), L<2.
:- task_evening_color(qx, C, D, I), not day_assign(P,D,qx,C,evening,I).

% SemanalR_06, SemanalR_07
:- task(consultation, D), day_assign(P,D,consultation,null,morning,null), level(P,L), L<3.
:- task(consultation, D), not day_assign(_,D,consultation,null,morning,null).

% SemanalR_08
:- task_evening(consultation, D), day_assign(P,D,consultation,null,evening,null), level(P,L), L<4.
:- task_evening(consultation, D), not day_assign(_,D,consultation,null,evening,null).

% SemanalR_09, SemanalR_10
:- task(carca, D), day_assign(P,D,carca,null,morning,null), level(P,L), L<3.
:- task(carca, D), not day_assign(_,D,carca,null,morning,null).

% SemanalR_11
:- task(cerdo, D), Cnt = #count { P : day_assign(P,D,cerdo,null,morning,null) }, Cnt < 2.

% SemanalR_12
%:- task(cerdo, D), not 1{day_assign(P,D,cerdo,null,morning,null) : person(P), level(P,L), L>2}.
:- task(cerdo, D), not day_assign(P,D,cerdo,null,morning,null): level(P,L), L>2.

% SemanalR_19, SemanalR_20
:- task(qxrobot, D), day_assign(P,D,qxrobot,null,morning,null), level(P,L), L<3.
:- task(qxrobot, D), not day_assign(_,D,qxrobot,null,morning,null).

% SemanalR_15, SemanalR_16
:- day_assign(P,D,T,C,DM,I), day_assign(P,D,T',C',DM,I'),
    (T,C,I) < (T',C',I'), (T,C)!=(floor,yellow), (T',C')!=(floor,yellow).
:- day_assign(P,D,T,C,DM,I), day_assign(P,D,T',C',DM,I'),
    (T,C,I) < (T',C',I'), (T,C)!=(qx,yellow), (T',C')!=(qx,yellow).

% SemanalR_17
:- day_assign(P,D,_,_,evening,_), day_assign_guard_from_month(P,D).
:- day_assign(P,D,_,_,evening,_), day_assign_from_month(P,D,e).
:- day_assign(P,D,_,_,evening,_), day_assign_from_month(P,D,i).
% SemanalR_18
:- day_assign(P,D,_,_,_,_), prev_day(D,D'), day_assign_guard_from_month(P,D').


#show day_assign/6.
#show vacation/2.
