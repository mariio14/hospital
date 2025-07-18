% Planificacion anual

section(blue;red;pink;brown;yellow;green;purple).
service(nutrition;rea;xray;vascular;thoracic;valencia;other).
turn(T) :- service(T).
turn(T) :- section(T).

month(1..12).

% Los siguientes datos vienen del input.lp, descomentar para ejecutar solo yearly.lp
% person(1..15).
% level(P,(P-1)/3 + 1) :- person(P).
% cost(car01,20). cost(car02,10). cost(cas01,100). cost(cas02,25). cost(cas03,3). cost(cas04,10).
% cost(cas05,3). cost(cas06,10). cost(cas07,5). cost(cas08,10).

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

occup_min(L,T,N) :- occup_exact(L,T,N).
occup_max(L,T,N) :- occup_exact(L,T,N).
% Aplicar las restricciones anteriores (exact, min, max)
:- level(P,L), occup_min(L,T,N), #count{X:month_assign(P,X,T)}<N.      % Actividades a las que se asigna al menos N meses
:- level(P,L), occup_max(L,T,N), #count{X:month_assign(P,X,T)}>N.      % Actividades a las que se asigna como mucho N meses

%     month_assign(P, M, T),
%     not month_assign(P, M+1, T),
%     month_assign(P, M', T), M' > M+1,

nonconsecutive(P,T) :- month_assign(P, M, T), not month_assign(P, M+1, T),
                         month_assign(P, M', T), M' > M+1.

% Aplicar las restricciones anteriores (consecutive)
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

% Aplicar las restricciones anteriores de demanda mínima
:- month(M), turn(T), demmand_min(T,N), % Para cada mes, para un turno con demanda minima N
    #count{X:month_assign(X,M,T)}<N.   % Que haya N o mas personas en turno T en el mes M

% Aplicar las preferencias anteriores de demanda máxima
cost_per_month(C,T,M) :- month(M),
    demmand_max(T, N, V),
    Count = #count { X : month_assign(X, M, T) },
    Count > N,
    C = (Count - N) * V.

#minimize { C,T,M : turn(T), month(M),
    cost_per_month(C, T, M)
}.

% CAS04,5,6,7,8
exceeded(M,T,N') :- month(M), demmand_max(T,N,V), N' = #count { X : month_assign(X, M, T) }, N' > N.
#minimize {V*(N'-N),M,T: exceeded(M,T,N'), demmand_max(T,N,V)}.

% AS08
:- month(M), service(S),
    month_assign(P, M, S),
    month_assign(P', M, S),
    P!=P'.


% CAR01
#minimize { V,P,T : person(P), turn(T),
    month_assign(P, M, T),
    not month_assign(P, M+1, T),
    month_assign(P, M', T), M' > M+1,
    cost(car01, V)
}.


% CAR02
 #minimize { V,P,T : person(P), turn(T),
     level(P, L), L>3,
     month_assign(P,M,T),
     not month_assign(P, M+1, T),
     month_assign(P, M', T), M' > M+1,
     cost(car02, V)
 }.


% CAS01  (PRIORIDAD 2)
#minimize { V@2,M,T : person(P), person(P'),
    level(P, 5), level(P', 5),
    turn(T),
    month_assign(P, M, T), month_assign(P', M, T), P < P', cost(cas01, V)
}.


% CAS02 - predicados y preparación (sin esto 0.9s, con esto mas de 11min)
% Predicados auxiliares para verificar la presencia de niveles específicos.
has_high_level(M, T) :- month_assign(P, M, T), level(P, 4).
has_high_level(M, T) :- month_assign(P, M, T), level(P, 5).

has_low_level(M, T) :- month_assign(P, M, T), level(P, 1).
has_low_level(M, T) :- month_assign(P, M, T), level(P, 2).
has_low_level(M, T) :- month_assign(P, M, T), level(P, 3).

%unmixed_levels(M, T) :- multiple_people(M, T), not has_high_level(M, T), has_low_level(M, T).
%unmixed_levels(M, T) :- multiple_people(M, T), has_high_level(M, T), not has_low_level(M, T).

% Regla auxiliar que identifica turnos con más de una persona.
multiple_people(M, T) :- month(M), turn(T), month_assign(P, M, T), month_assign(P', M, T), P<P'.

%#minimize { V,T,M : turn(T), multiple_people(M, T),
% unmixed_levels(M, T),
% cost(cas02, V)
%}.

#minimize { V,T,M : turn(T), multiple_people(M, T),
    not has_low_level(M, T),
    cost(cas02, V)
}.
#minimize { V,T,M : turn(T), multiple_people(M, T),
    not has_high_level(M, T),
    cost(cas02, V)
}.


% CAS03 - predicados y preparación
external_service_assign(P, M, S) :- month_assign(P, M, S), service(S).

global_count(N) :-
    N = #count { P,M : external_service_assign(P,M,S) }.

% el global count se puede obtener mediante el month_count

month_count(M, N) :-
    month(M),
    N = #count { P : external_service_assign(P, M, S) }.

difference(M, D) :-
    month(M),
    global_count(G),
    month_count(M, N),
    D = G/12 - N,
    N < G/12.

difference(M, D) :-
    month(M),
    global_count(G),
    month_count(M, N),
    D = N - G/12,
    N >= G/12.

#minimize { V*N : difference(M,N),
    cost(cas03, V)
}.
