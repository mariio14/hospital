% Planificacion mensual

% task(T,N) -> task T has N people assigned to it every day
task(g,2). task(e,1). task(i,1). task(c,1).
task_real(g,2). task_real(e,1). task_real(i,1).

guard(g;gp).

% MensualR_C01, MensualR_G01
:- day(D), task(T,N), #count{P: day_assign(P,D,T)}!=N. %% ver si esta bien
:- day_assign(P,D,T), vacation(P,D).
:- day_assign(P,D,T), day_not_assign(P,D,T).

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

% MensualR_G08
:- level(P,1), level(P',1), day_assign(P,D,g), day_assign(P',D,g), P!=P'.

% Predicate for MensualP_G10    people_in_task_in_weekend(N,T,D) -> there is N people assigned to task T on weekend D
people_in_task_in_weekend(N,T,D) :- task_real(T, _), weekend(D),
    N = #count{P: weekend_day(D,D'),day_assign(P,D',T)}.

% MensualR_G14
:- day_assign(P,D,g), day_assign(P',D,g),
    P!=P', level(P,5), level(P',5).

% MensualR_G15
:- day_assign_guard(P,D,_), vacation(P,D+1), D>0.


#show day_assign/3.
#show vacation/2.