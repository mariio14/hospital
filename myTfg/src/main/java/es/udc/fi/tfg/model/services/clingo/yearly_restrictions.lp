% Planificacion anual

section(blue;red;pink;brown;yellow;green;purple).
service(nutrition;rea;xray;vascular;thoracic;valencia;other).
turn(T) :- service(T).
turn(T) :- section(T).

month(1..12).

% month_assign(P,M,S): Person P at month M is assigned S
:- person(P), month(M), not month_assign(P,M,T).

% occup_min(L,T,N) = persons of level L must have activity T at least N months
% occup_exact(L,T,N) = persons of level L must have activity T exactly N months
% occup_max(L,T,N) = persons of level L must have activity T at most N months.
% occup_consecutive(L, S) The occupation of persons of level L in activity T must be consecutive

occup_exact(1,nutrition,1).     % AR01
occup_exact(2,rea,1).           % AR02
occup_exact(2,xray,1).          % AR03
occup_exact(3,vascular,1).      % AR04
occup_exact(3,thoracic,1).      % AR05
occup_exact(4,valencia,1).      % AR06

% AR07
occup_min(4,other,1).
occup_min(5,other,1).
occup_max(4,other,2).
occup_max(5,other,2).

% AR08
occup_min(1,blue,2).
occup_min(2,blue,2).
occup_min(3,blue,2).
occup_min(4,blue,3).
occup_min(5,blue,3).

% AR09
occup_exact(2,brown,1).
occup_exact(3,brown,1).
occup_exact(4,brown,1).
occup_exact(5,brown,1).

% AR10
occup_min(2,red,2).
occup_min(3,red,2).
occup_min(4,red,2).
occup_min(5,red,2).

% AR11
occup_exact(2,pink,2).
occup_exact(4,pink,2).
occup_consecutive(2, pink).
occup_consecutive(4, pink).

% AR12
occup_exact(1,green,4).
occup_exact(2,green,1).
occup_exact(3,green,1).
% occup_exact(4,green,1).
occup_exact(5,green,1).

% AR13
occup_min(1,purple,3).

% AR14
occup_exact(2,yellow,2).
occup_exact(3,yellow,2).
occup_exact(4,yellow,2).
occup_min(5,yellow,2).

occup_min(L,T,N) :- occup_exact(L,T,N).
occup_max(L,T,N) :- occup_exact(L,T,N).
% Apply previous restrictions(exact, min, max)
:- level(P,L), occup_min(L,T,N), #count{X:month_assign(P,X,T)}<N.      % Activities assigned at least N months
:- level(P,L), occup_max(L,T,N), #count{X:month_assign(P,X,T)}>N.      % Activities assigned at most N months

nonconsecutive(P,T) :- month_assign(P, M, T), not month_assign(P, M+1, T),
                         month_assign(P, M', T), M' > M+1.

% Apply previous restrictions (consecutive)
% :- level(P,L), occup_consecutive(L,T,N), month_assign(P,M,T), not month_assign(P,M-1,T), not month_assign(P,M+N-1,T).
:- level(P, L), occup_consecutive(L,T),                % Having a Person P, with Level L
    nonconsecutive(P,T).

% demmand_min(S, N) The service S demands N people.
demmand_min(blue, 3).           % AS01
demmand_min(pink, 1).           % AS02
demmand_min(red, 2).            % AS03
demmand_min(yellow, 1).         % AS04
demmand_min(purple, 1).         % AS05
demmand_min(green, 1).          % AS06
demmand_min(brown, 1).          % AS07

% demmand_max(S, N) The service S should take a maximum of N people.
demmand_max(pink, 1, V) :- cost(cas04, V).        % CAS04
demmand_max(yellow, 3, V) :- cost(cas05, V).      % CAS05
demmand_max(purple, 1, V) :- cost(cas06, V).      % CAS06
demmand_max(green, 2, V) :- cost(cas07, V).       % CAS07
demmand_max(brown, 1, V) :- cost(cas08, V).       % CAS08

% Apply previous restrictions of min demmand
:- month(M), turn(T), demmand_min(T,N), % Para cada mes, para un turno con demanda minima N
    #count{X:month_assign(X,M,T)}<N.   % Que haya N o mas personas en turno T en el mes M


% AS08
:- month(M), service(S),
    month_assign(P, M, S),
    month_assign(P', M, S),
    P!=P'.
