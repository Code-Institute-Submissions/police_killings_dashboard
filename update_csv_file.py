import csv
with open("data/police_killings.csv","r") as source:
    rdr= csv.reader( source )
    with open("data/updated_csv_file.csv","w") as result:
        wtr= csv.writer( result )
        for r in rdr:
            wtr.writerow( (r[0], r[1], r[2], r[3], r[9], r[19], r[31]) )