% Planificacion mensual

task(g,2).
task(e,1).
task(i,1).
task(c,1).

guard(g;gp).

% Comentar estas lineas si se ejecuta con input.lp
%day(1..31).
%weekend(-1;6;13;20;27). % Marcado por los viernes
%holiday(7;28).
%person(1..15).
%day_assign(1,5,v). % Person P on vacation
%day_assign(13,29,v).
%day_assign(13,30,v).
%level(P,(P-1)/3 + 1) :- person(P).
%day_assign(1,4,gp).
%day_assign(1,13,gp). % MensualR_G4
%day_assign(1,24,gp).
%day_assign(2,7,gp).
%day_assign(2,11,gp).
%day_assign(2,22,gp).
%new_residents().  % meter un predicado para cada R1 / que controlen ellos?

% MensualR_C1, MensualR_G1,
N {day_assign(P,D,T) : person(P)} N :- task(T, N), day(D).  % meter dias habiles?
% Alternativa: (probar ambas) (antes habia vacation(P,D), ahora no se si hace falta)
% N {day_assign(P,D,T) : person(P)} N :- task(T, N), day(D).
% :- day_assign(P,D,v), day_assign(P,D,_).

% MensualR_L2   meter en choice rule?
:- level(P,1), day_assign(P,_,e).
:- level(P,2), day_assign(P,_,e).

% MensualR_G2, MensualR_V1
:- day_assign(P,D,T), day_assign(P,D,T'), T!=T'.

%:- day(D), #count{P:day_assign(P,D,g)}!=2.

% MensualR_G5
day_assign_guard(P,D,G) :- guard(G), day_assign(P,D,G).
:- person(P), #count{D:day_assign_guard(P,D,_)}<4.
:- person(P), #count{D:day_assign_guard(P,D,_)}>6.

% MensualR_G6
:- guard(G), day_assign(P,D,G), day_assign(P,D+1,G).

% MensualR_G8
:- level(P,1), level(P',1), day_assign(P,D,g), day_assign(P',D,g), P!=P'.

%:- day(D), not day_assign(_,D,e). % meter dias habiles?
%:- day(D), not day_assign(_,D,i). % meter dias habiles?
%:- day(D), not day_assign(_,D,c).

% MensualR_L1
%:- level(P,1), new_residents(), day_assign(P,_,i).

#show day_assign/3.


% predicado weekend marcado por viernes
% por cada finde y cada tarea minimizar el n de personas asignadas