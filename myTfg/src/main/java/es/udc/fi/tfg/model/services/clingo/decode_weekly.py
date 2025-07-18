import clingo
import sys
import json
from collections import OrderedDict

if len(sys.argv) < 2:
    print("Uso: python decode_weekly.py file1 [file2 ... ]")
    sys.exit()

ctl = clingo.Control()

ctl.configuration.solve.opt_mode = "opt"

for arg in sys.argv[1:]:
    ctl.load(arg)
ctl.ground([("base", [])])

with ctl.solve(yield_=True) as handle:
    optimal_model = None
    for model in handle:
        optimal_model = model

    assignments = {}

    if optimal_model:
        for atom in optimal_model.symbols(shown=True):
            if atom.name == "day_assign" and len(atom.arguments) == 3:
                person = str(atom.arguments[0])
                day = atom.arguments[1].number
                activity = str(atom.arguments[2])

                if person not in assignments:
                    assignments[person] = {}
                assignments[person][day] = activity

            if atom.name == "vacation" and len(atom.arguments) == 2:
                person = str(atom.arguments[0])
                day = atom.arguments[1].number

                if person not in assignments:
                    assignments[person] = {}
                assignments[person][day] = "v"

ordered_assignments = OrderedDict(
    sorted(
        {person: OrderedDict(sorted(days.items())) for person, days in assignments.items()}.items()
    )
)

print(json.dumps(ordered_assignments, indent=4))