import clingo
import sys
import json
from collections import OrderedDict

if len(sys.argv) < 2:
    print("Uso: python decode_weekly.py file1 [file2 ... ]")
    sys.exit()

ctl = clingo.Control()

# Quitamos opt_mode para que devuelva también soluciones no óptimas
# Si quieres solo óptimas, deja esto activo:
# ctl.configuration.solve.opt_mode = "opt"

for arg in sys.argv[1:]:
    ctl.load(arg)
ctl.ground([("base", [])])

def extract_assignments(model):
    assignments = {}
    for atom in model.symbols(shown=True):
        if atom.name == "day_assign" and len(atom.arguments) == 6:
            person = str(atom.arguments[0])
            day = atom.arguments[1].number
            activity_part1 = str(atom.arguments[4])
            activity_part2 = str(atom.arguments[2])
            activity_part3 = str(atom.arguments[3])

            activity = activity_part1 + activity_part2 + "_" + activity_part3

            if activity_part2.lower() == 'qx':
                activity += "_" + str(atom.arguments[5])

            assignments.setdefault(person, {}).setdefault(day, []).append(activity)

        elif atom.name == "vacation" and len(atom.arguments) == 2:
            person = str(atom.arguments[0])
            if person == "dummyname":
                continue
            day = atom.arguments[1].number
            assignments.setdefault(person, {}).setdefault(day, []).append("v")

    return OrderedDict(
        sorted(
            {p: OrderedDict(sorted(d.items())) for p, d in assignments.items()}.items()
        )
    )

solutions = []

with ctl.solve(yield_=True) as handle:
    for model in handle:
        assignments = extract_assignments(model)
        cost = tuple(model.cost)  # coste como tupla para ordenarlo
        solutions.append((cost, assignments))

# Ordenar por coste ascendente
solutions.sort(key=lambda x: x[0])

# Quedarse con las 5 mejores
best_5 = [assignments for cost, assignments in solutions[:5]]

print(json.dumps(best_5, indent=4))