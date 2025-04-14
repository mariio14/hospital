import clingo
import sys
import json
from collections import OrderedDict

if len(sys.argv) < 2:
    print("Uso: python decode_monthly.py file1 [file2 ... ]")
    sys.exit()

ctl = clingo.Control()
for arg in sys.argv[1:]:
    ctl.load(arg)
ctl.ground([("base", [])])

with ctl.solve(yield_=True) as handle:
    assignments = {}

    for model in handle:
        for atom in model.symbols(atoms=True):
            if atom.name == "day_assign" and len(atom.arguments) == 3:
                person = str(atom.arguments[0])
                day = atom.arguments[1].number
                activity = str(atom.arguments[2])

                if day in (0, -1):
                    continue

                if person not in assignments:
                    assignments[person] = {}
                assignments[person][day] = activity

ordered_assignments = OrderedDict(
    sorted(
        {person: OrderedDict(sorted(days.items())) for person, days in assignments.items()}.items()
    )
)

print(json.dumps(ordered_assignments, indent=4))
