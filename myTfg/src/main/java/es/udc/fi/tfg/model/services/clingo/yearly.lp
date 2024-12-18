section(blue;red;pink;brown;yellow;green;purple).
service(nutrition;rea;xray;vascular;thoracic;valencia;other).
turn(T) :- service(T).
turn(T) :- section(T).

person(1..15).
level(P,(P-1)/3 + 1) :- person(P).
month(1..12).

% month_assign(P,M,S): Person P at month M is assigned S
1 {month_assign(P,M,T) : turn(T)} 1:- person(P), month(M).
aux(M,T) :- month_assign(4,M,T).
%show month_assign/3.

% occup_min(L,T,N) = persons of level L must have activity T at least N months
% occup_exact(L,T,N) = persons of level L must have activity T exactly N months
% occup_max(L,T,N) = persons of level L must have activity T at most N months.
% occup_consecutive(L, S) The occupation of persons of level L in activity T must be consecutive
occup_exact(1,nutrition,1).
occup_exact(2,rea,1).
occup_exact(2,xray,1).
occup_exact(3,vascular,1).
occup_exact(3,thoracic,1).
occup_exact(4,valencia,1).

% otras
occup_min(4,other,1).
occup_min(5,other,1).

occup_max(4,other,2).
occup_max(5,other,2).

% mama 
occup_exact(2,pink,2).
occup_exact(4,pink,2).

occup_consecutive(2, pink).
occup_consecutive(4, pink).

% pared
occup_exact(1,green,4).
occup_exact(2,green,1).
occup_exact(3,green,1).
occup_exact(4,green,1).
occup_exact(5,green,1).

% urgencias
occup_min(1,purple,3).

% esofago
occup_exact(2,yellow,2).
occup_exact(3,yellow,2).
occup_exact(4,yellow,2).
occup_min(5,yellow,2).

:- level(P,L), occup_exact(L,T,N), #count{X:month_assign(P,X,T)}!=N.   % Actividades a las que se asigna N meses
:- level(P,L), occup_min(L,T,N), #count{X:month_assign(P,X,T)}<N.      % Actividades a las que se asigna al menos N meses
:- level(P,L), occup_max(L,T,N), #count{X:month_assign(P,X,T)}>N.      % Actividades a las que se asigna como mucho N meses

% :- level(P,L), occup_consecutive(L,T,N), month_assign(P,M,T), not month_assign(P,M-1,T), not month_assign(P,M+N-1,T).
:- level(P, L), occup_consecutive(S, L),                % Having a Person P, with Level L
    month_assign(P, M, S), not month_assign(P, M+1, S), % Being M the last month assigned
    month_assign(P, M', S), M' > M+1.                   % Cannot be that exists M' later than M+1


% demmand_min(S, N) The service S demands N people.
demmand_min(blue, 3).
demmand_min(pink, 1).
demmand_min(red, 2).
demmand_min(yellow, 1).
demmand_min(purple, 1).
demmand_min(green, 1).
demmand_min(brown, 1).

:- month(M), turn(T), demmand_min(T,N), % Para cada mes, para un turno con demanda minima N
    #count{X:month_assign(X,M,T)}<N.   % Que haya N o mas personas en turno T en el mes M


% AS08
#minimize { 1@1, P, P', M, T : person(P), person(P'),
    level(P, 5), level(P', 5),
    turn(T),
    month_assign(P, M, T), month_assign(P', M, T), P < P' }.
