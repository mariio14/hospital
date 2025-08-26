% Planificacion semanal

% dummys to avoid warnings
day_not_assign(1,1,qx).
task(dummy, dummy).
task_color(dummy, dummy, dummy, dummy, dummy).
task_color(dummy, dummy, dummy, dummy).
task_evening(dummy, dummy).
task_evening_color(dummy, dummy, dummy, dummy).

cost(semanalP_22, 1).
cost(semanalP_23, 2).
cost(semanalP_24, 1).
cost(semanalP_25, 2).
cost(semanalP_26, 1).
cost(semanalP_27, 1).
cost(semanalP_28, 1).
cost(semanalP_29, 1).

% SemanalR_01
N {day_assign(P,D,qx,C,morning,I) : person(P), not vacation(P,D), not day_not_assign(P,D,qx)} :- task_color(qx, C, D, N, I).
% SemanalP_22
cnt_assign_qx_m(D,C,I,Cnt) :-
    Cnt = #count { P : day_assign(P,D,qx,C,morning,I) },
    task_color(qx,C,D,N,I).
#minimize { V*(Cnt-1),D,I :
    task_color(qx,C,D,N,I), cnt_assign_qx_m(D,C,I,Cnt), Cnt > 1,
    cost(semanalP_22, V)
}.
% SemanalP_23
cnt_assign_qx_not_color(D,C,I,Cnt) :-
    Cnt = #count { P : day_assign(P,D,qx,C,morning,I), not month_assign(P,D,C) },
    task_color(qx,C,D,N,I).
#minimize { V*Cnt,D,I :
    task_color(qx,C,D,N,I), cnt_assign_qx_not_color(D,C,I,Cnt),
    cost(semanalP_23, V)
}.


% SemanalR_13,
1 {day_assign(P,D,qx,C,evening,I) : person(P), level(P,L), L>1, not vacation(P,D), not day_not_assign(P,D,qx)} :- task_evening_color(qx, C, D, I).
% SemanalP_24
cnt_assign_qx_e(D,C,I,Cnt) :-
    Cnt = #count { P : day_assign(P,D,qx,C,morning,I) },
    task_color(qx,C,D,N,I).
#minimize { V*(Cnt-1),D,I :
    task_evening_color(qx, C, D, I), cnt_assign_qx_e(D,C,I,Cnt), Cnt > 1,
    cost(semanalP_24, V)
}.
cnt_assign_qx_e_not_color(D,C,I,Cnt) :-
    Cnt = #count { P : day_assign(P,D,qx,C,morning,I), not month_assign(P,D,C) },
    task_color(qx,C,D,N,I).
% SemanalP_25
#minimize { V*Cnt,D,I :
    task_evening_color(qx, C, D, I), cnt_assign_qx_e_not_color(D,C,I,Cnt),
    cost(semanalP_25, V)
}.


% SemanalR_06, SemanalR_07
1 {day_assign(P,D,consultation,null,morning,null) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,consultation)} :- task(consultation, D), day(D).
cnt_assign_consult_m(D,Cnt) :-
    Cnt = #count { P : day_assign(P,D,consultation,_,morning,_) },
    task(consultation,D).
% SemanalP_26
#minimize { V*(Cnt-1),D :
    task(consultation, D), cnt_assign_consult_m(D,Cnt), Cnt > 1,
    cost(semanalP_26, V)
}.


% SemanalR_08
1 {day_assign(P,D,consultation,null,evening,null) : person(P), level(P,L), L>3, not vacation(P,D), not day_not_assign(P,D,consultation)} :- task_evening(consultation, D).
cnt_assign_consult_e(D,Cnt) :-
    Cnt = #count { P : day_assign(P,D,consultation,_,evening,_) },
    task(consultation,D).
% SemanalP_27
#minimize { V*(Cnt-1),D :
    task(consultation, D), cnt_assign_consult_e(D,Cnt), Cnt > 1,
    cost(semanalP_27, V)
}.

% SemanalR_09, SemanalR_10
1 {day_assign(P,D,carca,null,morning,null) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,carca)} :- task(carca, D).
cnt_assign_carca(D,Cnt) :-
    Cnt = #count { P : day_assign(P,D,carca,_,morning,_) },
    task(carca,D).
% SemanalP_28
#minimize { V*(Cnt-1),D :
    task(carca, D), cnt_assign_carca(D,Cnt), Cnt > 1,
    cost(semanalP_28, V)
}.


% SemanalR_11
2 {day_assign(P,D,cerdo,null,morning,null) : person(P), not vacation(P,D), not day_not_assign(P,D,cerdo)} :- task(cerdo, D).
cnt_assign_cerdo(D,Cnt) :-
    Cnt = #count { P : day_assign(P,D,cerdo,_,morning,_) },
    task(cerdo,D).
% SemanalP_29
#minimize { V*(Cnt-1),D :
    task(cerdo, D), cnt_assign_cerdo(D,Cnt), Cnt > 1,
    cost(semanalP_29, V)
}.


% SemanalR_12
%:- task(cerdo, D), not 1{day_assign(P,D,cerdo,null,morning,null) : person(P), level(P,L), L>2}.
:- task(cerdo, D), not day_assign(P,D,cerdo,null,morning,null): level(P,L), L>2.

% SemanalR_19, SemanalR_20
1 {day_assign(P,D,qxrobot,null,morning,null) : person(P), level(P,L), L>2, not vacation(P,D), not day_not_assign(P,D,qxrobot)} 1 :- task(qxrobot, D).

% SemanalR_02
{day_assign(P,D,floor,C,morning,null) : person(P), not vacation(P,D), month_assign(P,D,C), not day_not_assign(P,D,floor)} :- task_color(floor,C,D,_).
% SemanalP_22
#minimize { V,D :
    task_color(floor,yellow,D,_), day_assign(P,D,qx,yellow,_,_), month_assign(P,D,yellow),
    not day_assign(P,D,floor,yellow,_,_),
    cost(semanalP_22, V)
}.

% SemanalR_15, SemanalR_16
:- day_assign(P,D,T,C,DM,I), day_assign(P,D,T',C',DM,I'),
    (T,C,I) < (T',C',I'), (T,C)!=(floor,yellow), (T',C')!=(floor,yellow).

% SemanalP_03, SemanalP_04, SemanalP_05
color_floor_assigned(C,D) :- day_assign(P,D,floor,C,_,_), person(P), month_assign(P,D,C).
#minimize { V,C,D :
    day(D), not color_floor_assigned(C,D),   % IDEA: cambiar por conditional literal
    cost(semanalP_03_4_5, C,V)
}.

% SemanalP_14
#minimize { V,P,D :
    day_assign(P,D,qx,_,evening,_), level(P,L), L>4,
    cost(semanalP_14, V)
}.

% SemanalR_17
:- day_assign(P,D,_,_,evening,_), day_assign_guard_from_month(P,D).
:- day_assign(P,D,_,_,evening,_), day_assign_from_month(P,D,e).
:- day_assign(P,D,_,_,evening,_), day_assign_from_month(P,D,i).
% SemanalR_18
:- day_assign(P,D,_,_,_,_), prev_day(D,D'), day_assign_guard_from_month(P,D').

% SemanalP_21
#minimize { V,P,D :
    day_assign(P,D,qxrobot,_,_,_), level(P,5),
    cost(semanalP_21, V)
}.

#show day_assign/6.
#show vacation/2.
