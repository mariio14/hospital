import clingo
import sys

if len(sys.argv) < 2:
    print("Uso: python decode.py file1 [file2 ... ]")
    sys.exit()

output_file = "solution.txt"

ctl = clingo.Control()
for arg in sys.argv[1:]:
    ctl.load(arg)
ctl.ground([("base", [])])

with ctl.solve(yield_=True) as handle:
    assignments = {} 
    months = set()

    for model in handle:
        for atom in model.symbols(atoms=True):
            if atom.name == "month_assign" and len(atom.arguments) == 3:
                person = atom.arguments[0].number
                month = atom.arguments[1].number
                turn = str(atom.arguments[2])
                
                if person not in assignments:
                    assignments[person] = {}
                assignments[person][month] = turn
                months.add(month)

months = sorted(months)

with open(output_file, "w") as f:
    f.write("Persona\\Mes ")
    for month in months:
        f.write(f"Mes {month:2} ")
    f.write("\n")

    for person in sorted(assignments.keys()):
        f.write(f"Persona {person:2} ")
        for month in months:
            turn = assignments[person].get(month, "-")
            f.write(f" {turn:5} ")
        f.write("\n")

print(f"Resultados guardados en {output_file}")
