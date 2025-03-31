% Planificacion mensual

task(g,2).
task(e,1).
task(i,1).
task(c,1).

guard(g;gp).

% Comentar estas lineas si se ejecuta con input.lp
day(1..31).
weekend(-1;6;13;20;27). % Marcado por los viernes
holiday(7;28).
person(1..15).
day_assign(1,5,v). % Person P on vacation
day_assign(13,29,v).
day_assign(13,30,v).
level(P,(P-1)/3 + 1) :- person(P).
day_assign(1,4,gp).
day_assign(1,13,gp). % MensualR_G04
day_assign(1,24,gp).
day_assign(2,7,gp).
day_assign(2,11,gp).
day_assign(2,22,gp).
new_residents(true).  % meter un predicado para cada R1 / que controlen ellos?

cost(g07, 10).
cost(g09, 50).
cost(g10, 5).
cost(g12, 35).
cost(l04, 20).

% MensualR_C01, MensualR_G01,
N {day_assign(P,D,T) : person(P)} N :- task(T, N), day(D).  % meter dias habiles?
% Alternativa: (probar ambas) (antes habia vacation(P,D), ahora no se si hace falta)
% N {day_assign(P,D,T) : person(P)} N :- task(T, N), day(D).
% :- day_assign(P,D,v), day_assign(P,D,_).

% MensualR_L02   meter en choice rule?
:- level(P,1), day_assign(P,_,e).
:- level(P,2), day_assign(P,_,e).

% MensualR_L01
:- new_residents(true), level(P,1), day_assign(P,_,i).

% MensualR_G02, MensualR_V01
:- day_assign(P,D,T), day_assign(P,D,T'), T!=T'.

% MensualR_G05
day_assign_guard(P,D,G) :- guard(G), day_assign(P,D,G).
:- person(P), #count{D:day_assign_guard(P,D,_)}<4.
:- person(P), #count{D:day_assign_guard(P,D,_)}>6.

% MensualR_G06 (revisar)
:- day_assign_guard(P,D,_), day_assign_guard(P,D+1,_).

% MensualP_G07 (tarda muy poco)
#minimize { V,P,D :
    day_assign_guard(P,D,_), day_assign(P,D+1,_),
    cost(g07,V)
}.

% MensualR_G08
:- level(P,1), level(P',1), day_assign(P,D,g), day_assign(P',D,g), P!=P'.

% Predicate for MensualP_G09
veteran_in_guard(D) :- day_assign_guard(P,D,_), level(P,3).
veteran_in_guard(D) :- day_assign_guard(P,D,_), level(P,4).
veteran_in_guard(D) :- day_assign_guard(P,D,_), level(P,5).
% MensualP_G09 (de 0.035 a 0.045 mas o menos)
#minimize { V,D :
    day(D), not veteran_in_guard(D),
    cost(g09,V)
}.

% Predicate for MensualP_G10
people_in_task_in_weekend(N,T,D) :- task(T, _), weekend(D), N = #count{P: day_assign(P,D,T), 
day_assign(P,D+1,T), day_assign(P,D+2,T)}.

% MensualP_G10, MensualP_G11 (separar?)  (sin esto entre 0.014 y 0.022) (con entre 0.21 a 0.31)
#minimize { V*P,D,T : weekend(D), task(T, _),
    people_in_task_in_weekend(P,D+1,T),
    cost(g10, V)
}.

% Predicates for MensualP_G12 (algo esta mal, probar)
person_weekend_presential(P,D) :- person(P), weekend(D), day_assign_guard(P,D,_).
person_weekend_presential(P,D) :- person(P), weekend(D), day_assign_guard(P,D+1,_).
person_weekend_presential(P,D) :- person(P), weekend(D), day_assign_guard(P,D+2,_).
presential_weekends(P,N) :- person(P), N = #count{D: person_weekend_presential(P,D)}.
% MensualP_G12
#minimize { V*(N-2),P :
    person(P),
    presential_weekends(P,N), N>2,
    cost(g12,V)
}.

% MensualP_L04 (de 0.045 a 0.051)
#minimize { V,P,D : day_assign(P,D,i),
    day_assign_guard(P,D+1,_),
    cost(l04, V)
}.

#show day_assign/3.


% por cada finde y cada tarea minimizar el n de personas asignadas
% comentarios explicando predicados
% cambiar vacaciones por vacation

% Los nuevos lo contamos como inputs
% R1 nuevos pueden hacer de comodin?
% En los dias habiles tambien tiene que haber 2g, 1e y 1i? 
% comodin cuenta como tarea a minimizar en los weekends


% G03, G12, G13, L03, L05