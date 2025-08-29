% Planificacion mensual

% task(T,N) -> task T has N people assigned to it every day
task(g,2). task(e,1). task(i,1). task(c,1).
task_real(g,2). task_real(e,1). task_real(i,1).

guard(g;gp).

% Comentar estas lineas si se ejecuta con input.lp
%day(1..31).
%numDays(30).
%numLocations(60).
%weekend(-1;6;13;20;27). % Marcado por los viernes
%weekend_day(-1,-1). weekend_day(-1,0). weekend_day(-1,1).
%weekend_day(6,6). weekend_day(6,7). weekend_day(6,8).
%weekend_day(13,13). weekend_day(13,14). weekend_day(13,15).
%weekend_day(20,20). weekend_day(20,21). weekend_day(20,22).
%weekend_day(27,27). weekend_day(27,28). weekend_day(27,29).

%holiday(7;28).
%person(1..15).
%vacation(1,5). % Person P on vacation
%vacation(13,29).
%vacation(13,30).
%level(P,(P-1)/3 + 1) :- person(P).
%day_assign(1,4,gp).
%day_assign(1,13,gp). % MensualR_G04
%day_assign(1,24,gp).
%day_assign(2,7,gp).
%day_assign(2,11,gp).
%day_assign(2,22,gp).

%cost(mensualP_G03, 2).
%cost(mensualP_G07, 10).
%cost(mensualP_G09, 50).
%cost(mensualP_G10, 70).
%cost(mensualP_G11, 40).
%cost(mensualP_G12, 35).
%cost(mensualP_L03, 3).
%cost(mensualP_L04, 20).
cost(mensualP_G13, 4).


% MensualR_C01, MensualR_G01
N {day_assign(P,D,T) : person(P), not vacation(P,D), not day_not_assign(P,D,T)} N :- task(T, N), day(D).

% MensualR_L02
:- level(P,1), day_assign(P,_,e).
:- level(P,2), day_assign(P,_,e).

% MensualR_G02, MensualR_V01
:- day_assign(P,D,T), day_assign(P,D,T'), T!=T'.

% MensualR_G05
%   day_assign_guard(P,D,G) -> person P is assigned to guard G on day D
day_assign_guard(P,D,G) :- guard(G), day_assign(P,D,G).
:- person(P), #count{D:day_assign_guard(P,D,_),D>0}<4.
:- person(P), #count{D:day_assign_guard(P,D,_),D>0}>6.

% MensualR_G06
:- day_assign_guard(P,D,_), day_assign_guard(P,D+1,_).

% MensualP_G07
#minimize { V,P,D :
    day_assign_guard(P,D,_), day_assign(P,D+1,_),
    cost(mensualP_G07,V)
}.

% MensualR_G08
:- level(P,1), level(P',1), day_assign(P,D,g), day_assign(P',D,g), P!=P'.

% Predicate for MensualP_G09   veteran_in_guard(D) -> there is a veteran in guard at day D
veteran_in_guard(D) :- day_assign_guard(P,D,_), level(P,L), L>=3.
% MensualP_G09
#minimize { V,D :
    day(D), D>0, not veteran_in_guard(D),
    cost(mensualP_G09,V)
}.

% Predicate for MensualP_G10    people_in_task_in_weekend(N,T,D) -> there is N people assigned to task T on weekend D
people_in_task_in_weekend(N,T,D) :- task_real(T, _), weekend(D),
    N = #count{P: weekend_day(D,D'),day_assign(P,D',T)}.

% MensualP_G10
#minimize { V*(P-4),D,T : weekend(D), task_real(g, _),
    people_in_task_in_weekend(P,T,D), P>4,
    cost(mensualP_G10, V)
}.
% MensualP_G11
#minimize { V*(P-1),D,T : weekend(D), task_real(T, _), T!=g,
    people_in_task_in_weekend(P,T,D), P>1,
    cost(mensualP_G11, V)
}.

% Predicates for MensualP_G12
    % person_working_in_weekend(P,D) -> person P is working on weekend D
    % working_weekends(P,N) -> person P is working N weekends
person_working_in_weekend(P,D) :- person(P), weekend_day(D,D'),
    day_assign(P,D,T), task_real(T,_).
working_weekends(P,N) :- person(P), N = #count{D: person_working_in_weekend(P,D)}.
% MensualP_G12
#minimize { V*(N-2),P :
    person(P),
    working_weekends(P,N), N>2,
    cost(mensualP_G12,V)
}.

% MensualR_G14
:- day_assign(P,D,g), day_assign(P',D,g),
    P!=P', level(P,5), level(P',5).

% MensualR_G15
:- day_assign_guard(P,D,_), vacation(P,D+1), D>0.

% MensualP_L04
#minimize { V,P,D : day_assign(P,D,i),
    day_assign_guard(P,D+1,_),
    cost(mensualP_L04, V)
}.

% MensualP_G03
numGuards(P,N) :- person(P), N=#count{D: day_assign_guard(P,D,_),D>0}.

#minimize { V*(N-5)@2,P :
    numGuards(P,N),
    N>5,
    cost(mensualP_G03,V)
}.

% MensualP_L03 (de 0.1 a 1.625 con 30 dias; con 31 dias se va de tiempo)
day_assign_location(P,D,e) :- day_assign(P,D,e).
day_assign_location(P,D,i) :- day_assign(P,D,i).
numLocation_per_person(P,N) :- person(P), N = #count{D : day_assign_location(P,D,_)}.

#minimize { V*(N'/15-N),P :
    numLocation_per_person(P,N),
    numLocations(N'),
    N<N'/15,
    cost(mensualP_L03,V)
}.

numComodin_per_person(P,N) :- person(P), N = #count{D : day_assign(P,D,c)}.

#minimize { V*(N'/15-N),P :
    numComodin_per_person(P,N),
    numDays(N'),
    N<N'/15,
    cost(mensualP_L03,V)
}.

% MensualP_G13
  %  total_day_assign(P,N) -> person P has been assigned to N tasks
  %  sumDays(P,S) -> sum of day numbers for person P
  %  mean(P,M) -> average of day numbers for person P
  %  difference_from_optimal_mean(P,M) -> | average of day numbers for person P - optimal mean |
%total_day_assign(P,N) :- person(P), N = #count {D : day_assign(P,D,_)}.
%sumDays(P,S) :- person(P), S = #sum {D : day_assign(P,D,_)}.
%mean(P,M) :- person(P), sumDays(P,S), total_day_assign(P,N), N>0, M = S/N.
%difference_from_optimal_mean(P,D) :- person(P), mean(P,M), numDays(N), M>N/2, D = M-N/2.
%difference_from_optimal_mean(P,D) :- person(P), mean(P,M), numDays(N), N/2>M, D = N/2-M.

  %  diff_abs(P,D) -> difference from mean for a single day numbers for person P
  %  total_deviation(P,D) -> average of difference from mean for day numbers for person P
%diff_abs(P,N) :- day_assign(P,D,_), mean(P,M), D >= M, N = D - M.
%diff_abs(P,N) :- day_assign(P,D,_), mean(P,M), D < M, N = M - D.
%total_deviation(P,N) :- person(P), N = #sum {D : diff_abs(P,D)}.

%#minimize {V,P : mean(P,M), cost(mensualP_G13,V), numDays(N)}.
%#minimize {V*D,P : total_deviation(P,D), cost(mensualP_G13,V)}.


#show day_assign/3.
#show vacation/2.

% G13