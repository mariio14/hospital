import clingo
import sys
import json
from collections import OrderedDict

if len(sys.argv) < 2:
    print("Uso: python decode_monthly.py file1 [file2 ... ]")
    sys.exit()

ctl = clingo.Control()

# Si quieres permitir soluciones no óptimas, comenta la siguiente línea
ctl.configuration.solve.opt_mode = "opt"

for arg in sys.argv[1:]:
    ctl.load(arg)
ctl.ground([("base", [])])

solutions = []

with ctl.solve(yield_=True) as handle:
    for model in handle:
        assignments = {}

        for atom in model.symbols(shown=True):
            if atom.name == "day_assign" and len(atom.arguments) == 3:
                person = str(atom.arguments[0])
                day = atom.arguments[1].number
                activity = str(atom.arguments[2])

                if day in (0, -1):
                    continue

                if person not in assignments:
                    assignments[person] = {}
                assignments[person][day] = activity

            if atom.name == "vacation" and len(atom.arguments) == 2:
                person = str(atom.arguments[0])
                day = atom.arguments[1].number

                if day in (0, -1):
                    continue

                if person not in assignments:
                    assignments[person] = {}
                assignments[person][day] = "v"

        ordered_assignments = OrderedDict(
            sorted(
                {person: OrderedDict(sorted(days.items())) for person, days in assignments.items()}.items()
            )
        )

        cost = tuple(model.cost)  # Guardamos el coste para ordenar
        solutions.append((cost, ordered_assignments))

# Ordenar por coste ascendente
solutions.sort(key=lambda x: x[0])

# Quedarse con las 5 mejores
best_5 = [assignments for cost, assignments in solutions[:5]]

print(json.dumps(best_5, indent=4))