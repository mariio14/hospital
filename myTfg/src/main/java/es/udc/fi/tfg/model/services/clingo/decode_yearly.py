import clingo
import sys
import json
from collections import OrderedDict

if len(sys.argv) < 2:
    print("Uso: python decode_yearly.py file1 [file2 ... ]")
    sys.exit()

ctl = clingo.Control()
for arg in sys.argv[1:]:
    ctl.load(arg)
ctl.ground([("base", [])])

solutions = []

with ctl.solve(yield_=True) as handle:
    for model in handle:
        assignments = {}

        for atom in model.symbols(atoms=True):
            if atom.name == "month_assign" and len(atom.arguments) == 3:
                person = str(atom.arguments[0])
                month = atom.arguments[1].number
                turn = str(atom.arguments[2])

                if person not in assignments:
                    assignments[person] = {}
                assignments[person][month] = turn

        ordered_assignments = OrderedDict(
            sorted(
                {person: OrderedDict(sorted(months.items())) for person, months in assignments.items()}.items()
            )
        )

        cost = tuple(model.cost)  # Guardamos el coste como tupla
        solutions.append((cost, ordered_assignments))

# Ordenar por coste ascendente
solutions.sort(key=lambda x: x[0])

# Quedarse con las 5 mejores
best_5 = [assignments for cost, assignments in solutions[:5]]

print(json.dumps(best_5, indent=4))