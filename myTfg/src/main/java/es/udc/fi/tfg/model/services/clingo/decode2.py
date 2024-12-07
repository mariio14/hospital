import clingo
import sys
import json
from collections import OrderedDict

if len(sys.argv) < 2:
    print("Uso: python decode.py file1 [file2 ... ]")
    sys.exit()

output_file = "solution.json"

ctl = clingo.Control()
for arg in sys.argv[1:]:
    ctl.load(arg)
ctl.ground([("base", [])])

with ctl.solve(yield_=True) as handle:
    assignments = {}

    for model in handle:
        for atom in model.symbols(atoms=True):
            if atom.name == "month_assign" and len(atom.arguments) == 3:
                person = atom.arguments[0].number
                month = atom.arguments[1].number
                turn = str(atom.arguments[2])
                
                if person not in assignments:
                    assignments[person] = {}
                assignments[person][month] = turn

# Ordenar personas y meses
ordered_assignments = OrderedDict(
    sorted(
        {person: OrderedDict(sorted(months.items())) for person, months in assignments.items()}.items()
    )
)

# Exportamos los resultados como JSON
with open(output_file, "w") as f:
    json.dump(ordered_assignments, f, indent=4)

print(f"Resultados guardados en {output_file}")
