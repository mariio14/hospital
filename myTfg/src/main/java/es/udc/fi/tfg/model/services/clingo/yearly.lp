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

% num_min(L,T,N) = persons of level L must have activity T at least N months
% num_exact(L,T,N) = persons of level L must have activity T exactly N months
% num_or_num(L,T,N,X) = persons of level L must have activity T N or X months.
% num_in_a_row(L,T,N) = persons of level L must have activity T exactly N months in a row
num_exact(1,nutrition,1).
num_exact(2,rea,1).
num_exact(2,xray,1).
num_exact(3,vascular,1).
num_exact(3,thoracic,1).
num_exact(4,valencia,1).

% otras
num_or_num(4,other,1,2).
num_or_num(5,other,1,2).

% colon
num_min(1,blue,2).
num_min(2,blue,2).
num_min(3,blue,2).
num_min(4,blue,3).
num_min(5,blue,3).

% procto
num_exact(2,brown,1).
num_exact(3,brown,1).
num_exact(4,brown,1).
num_exact(5,brown,1).

% higado
num_min(2,red,2).
num_min(3,red,2).
num_min(4,red,2).
num_min(5,red,2).

% mama 
num_in_a_row(2,pink,2).
num_in_a_row(4,pink,2).

% pared
num_exact(1,green,4).
num_exact(2,green,1).
num_exact(3,green,1).
num_exact(4,green,1).
num_exact(5,green,1).

% urgencias
num_min(1,purple,3).

% esofago
num_exact(2,yellow,2).
num_exact(3,yellow,2).
num_exact(4,yellow,2).
num_min(5,yellow,2).

:- level(P,L), num_exact(L,T,N), #count{X:month_assign(P,X,T)}!=N.   % Actividades a las que se asigna N meses
:- level(P,L), num_min(L,T,N), #count{X:month_assign(P,X,T)}<N.      % Actividades a las que se asigna al menos N meses

% Meses seguidos
:- level(P,L), num_in_a_row(L,T,N), #count{X:month_assign(P,X,T)}!=N.  % Exactamente N meses
:- level(P,L), num_in_a_row(L,T,N), month_assign(P,M,T), not month_assign(P,M-1,T), not month_assign(P,M+N-1,T). % Que sean seguidos

