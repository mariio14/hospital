section(blue;red;pink;brown;yellow;green;purple).
service(nutrition;rea;xray;vascular;thoracic;valencia;other).
turn(T) :- service(T).
turn(T) :- section(T).

% person(1..15).
% level(P,(P-1)/3 + 1) :- person(P).
month(1..12).

% Definimos costes para las preferencias
cost(car01,20).
cost(car02,10).
cost(cas01,100).
cost(cas02,25).
cost(cas03,10).
cost(cas04,3).

% month_assign(P,M,S): Person P at month M is assigned S
1 {month_assign(P,M,T) : turn(T)} 1:- person(P), month(M).

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

% Aplicar las restricciones anteriores (exact, min, max)
:- level(P,L), occup_exact(L,T,N), #count{X:month_assign(P,X,T)}!=N.   % Actividades a las que se asigna N meses
:- level(P,L), occup_min(L,T,N), #count{X:month_assign(P,X,T)}<N.      % Actividades a las que se asigna al menos N meses
:- level(P,L), occup_max(L,T,N), #count{X:month_assign(P,X,T)}>N.      % Actividades a las que se asigna como mucho N meses

% Aplicar las restricciones anteriores (consecutive)
% :- level(P,L), occup_consecutive(L,T,N), month_assign(P,M,T), not month_assign(P,M-1,T), not month_assign(P,M+N-1,T).
:- level(P, L), occup_consecutive(S, L),                % Having a Person P, with Level L
    month_assign(P, M, S), not month_assign(P, M+1, S), % Being M the last month assigned
    month_assign(P, M', S), M' > M+1.                   % Cannot be that exists M' later than M+1


% demmand_min(S, N) The service S demands N people.
demmand_min(blue, 3).           % AS01
demmand_min(pink, 1).           % AS02
demmand_min(red, 2).            % AS03
demmand_min(yellow, 1).         % AS04
demmand_min(purple, 1).         % AS05
demmand_min(green, 1).          % AS06
demmand_min(brown, 1).          % AS07

% Aplicar las restricciones anteriores de demanda mínima
:- month(M), turn(T), demmand_min(T,N), % Para cada mes, para un turno con demanda minima N
    #count{X:month_assign(X,M,T)}<N.   % Que haya N o mas personas en turno T en el mes M


% AS08
:- month(M), service(S),
    month_assign(P, M, S),
    month_assign(P', M, S),
    P!=P'.


% CAR01
#minimize { V : person(P), turn(T),
    month_assign(P, M, T),
    not month_assign(P, M+1, T),
    month_assign(P, M', T), M' > M+1,
    cost(car01, V)
}.


% CAR02
#minimize { V : person(P), turn(T),
    level(P, L), L>3,
    month_assign(P, M, T),
    not month_assign(P, M+1, T),
    month_assign(P, M', T), M' > M+1,
    cost(car02, V)
}.


% CAS01
#minimize { V : person(P), person(P'),
    level(P, 5), level(P', 5),
    turn(T),
    month_assign(P, M, T), month_assign(P', M, T), P < P', cost(cas01, V)
}.


% CAS02 - peredicados y preparación
% Predicados auxiliares para verificar la presencia de niveles específicos.
has_high_level(M, T) :- month_assign(P, M, T), level(P, 4).
has_high_level(M, T) :- month_assign(P, M, T), level(P, 5).

has_low_level(M, T) :- month_assign(P, M, T), level(P, 1).
has_low_level(M, T) :- month_assign(P, M, T), level(P, 2).
has_low_level(M, T) :- month_assign(P, M, T), level(P, 3).

% Regla auxiliar que identifica turnos con más de una persona.
multiple_people(M, T) :- month(M), turn(T), #count{P : month_assign(P, M, T)} > 1.

% CAS02
#minimize { V : turn(T), multiple_people(M, T),
    not has_low_level(M, T),
    cost(cas02, V)
}.
#minimize { V : turn(T), multiple_people(M, T),
    not has_high_level(M, T),
    cost(cas02, V)
}.


% CAS03
#minimize { V : person(P), person(P'),
    service(T), turn(T),
    month_assign(P, M, T), month_assign(P', M, T), P < P', cost(cas03, V)
}.


% CAS04 - peredicados y preparación
months_man(S, N) :- service(S), N = #count{P, M : month_assign(P, M, S)}.

% Predicado auxiliar para acumular la suma total de meses-hombre
total_months_hombre(N') :- N' = #sum{N : months_man(_, N)}.

% CAS04
