import csv
import json
import urllib.request

GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmEW51hG93HEI5RTnpj6jsnRtlzqNKgiU119olahqyNE9xBMNtKY93asaR51vPWlskcIYqvFShQeyG/pub?output=csv"
with urllib.request.urlopen(GOOGLE_SHEET_URL) as response:
    reader = csv.DictReader(str(response.read(), 'utf-8').splitlines())
    data = []
    for row in reader:
        data.append(row)
    data = data[2:]
    # remove the field "Zuständig" and "Gemacht" from the data
    for row in data:
        del row["Zuständig"]
        del row["Gemacht"]
        row["title"] = row["Titel"]
        del row["Titel"]
        row["description"] = row["Beschreibung"]
        del row["Beschreibung"]
        row["url"] = row["URL"]
        del row["URL"]
        row["region"] = row["Region"]
        del row["Region"]
        row["language"] = [lang for lang in row["Sprache"].replace(" ",",").replace(";", ",").split(",") if lang != ""]
        del row["Sprache"]
        # replace "Sammlung abgeschlossen" with "collection_finished"
        if row["Sammlung abgeschlossen"] == "Ja" or row["Sammlung abgeschlossen"].lower() == "ja":
            row["collection_finished"] = True
        else:
            row["collection_finished"] = False
        del row["Sammlung abgeschlossen"]
        type = []
        # add the string "audiovisual sources" to the list "type" if the field "Audiovisuelle Quellen" is 1
        if row["Audiovisuelle Quellen"] == "1":
            type.append("audiovisual sources")
        del row["Audiovisuelle Quellen"]
        # add the string "books" to the list "type" if the field "Bücher" is 1
        if row["Bücher"] == "1":
            type.append("books")
        del row["Bücher"]
        # add the string "photos" to the list "type" if the field "Fotos" is 1
        if row["Fotos"] == "1":
            type.append("photos")
        del row["Fotos"]
        # add the string "maps" to the list "type" if the field "Karten & GeoDaten" is 1
        if row["Karten & GeoDaten"] == "1":
            type.append("maps")
        del row["Karten & GeoDaten"]
        # add the string "encyclopedias" to the list "type" if the field "Lexikon und Enzyklopädien" is 1
        if row["Lexikon und Enzyklopädie"] == "1":
            type.append("encyclopedias")
        del row["Lexikon und Enzyklopädie"]
        # add the string "primary sources" to the list "type" if the field "Primärquellen" is 1
        if row["Primärquellen"] == "1":
            type.append("primary sources")
        del row["Primärquellen"]
        # add the string "statistics" to the list "type" if the field "Statistiken & Zeitreihen" is 1
        if row["Statistiken & Zeitreihen"] == "1":
            type.append("statistics")
        del row["Statistiken & Zeitreihen"]
        # add the string "search engine" to the list "type" if the field "Suchmaschine" is 1
        if row["Suchmaschine"] == "1":
            type.append("search engine")
        del row["Suchmaschine"]
        # add the string "websites" to the list "type" if the field "Webseites (als Archivalie)" is 1
        if row["Websites (als Archivalie)"] == "1":
            type.append("websites")
        del row["Websites (als Archivalie)"]
        # add the string "newspapers" to the list "type" if the field "Zeitungen" is 1
        if row["Zeitungen"] == "1":
            type.append("newspapers")
        del row["Zeitungen"]
        # add the string "magazines" to the list "type" if the field "Zeitschriften" is 1
        if row["Zeitschriften"] == "1":
            type.append("magazines")
        del row["Zeitschriften"]
        # add the string "learning materials" to the list "type" if the field "Lernressourcen" is 1
        if row["Lernressource"] == "1":
            type.append("learning materials")
        del row["Lernressource"]
        # add the string "manuscripts" to the list "type" if the field "Manuskripte" is 1
        if row["Manuskripte"] == "1":
            type.append("manuscripts")
        del row["Manuskripte"]
        # add the string "tools" to the list "type" if the field "Wissenschaftliche Werkzeuge" is 1
        if row["Wissenschaftliche Werkzeuge"] == "1":
            type.append("tools")
        del row["Wissenschaftliche Werkzeuge"]
        row["type"] = type
        access = []
        # add the string "on demand" to the list "access" if the field "Auf Antrag" is 1
        if row["Auf Antrag"] == "1":
            access.append("on demand")
        del row["Auf Antrag"]
        # add the string "OA" to the list "access" if the field "OA" is 1
        if row["OA"] == "1":
            access.append("OA")
        del row["OA"]
        # add the string "offline" to the list "access" if the field "offline" is 1
        if row["offline"] == "1":
            access.append("offline")
        del row["offline"]
        # add the string "online" to the list "access" if the field "online" is 1
        if row["online"] == "1":
            access.append("online")
        del row["online"]
        # add the string "copyright" to the list "access" if the field "Copyright" is 1
        row["access"] = access
        reusability = []
        if row["Copyright"] == "1":
            reusability.append("copyright")
        del row["Copyright"]
        # add the string "cc or copyleft" to the list "reusability" if the field "CC/Cleft" is 1
        if row["CC/Cleft"] == "1":
            reusability.append("cc or copyleft")
        del row["CC/Cleft"]
        # add the string "pd/c0" to the list "reusability" if the field "PD/C0" is 1
        if row["PD/C0"] == "1":
            reusability.append("pd/c0")
        del row["PD/C0"]
        row["reusability"] = reusability
        period = []
        # add the string "contemporary" to the list "period" if the field "Zeitgeschichte (19. bis 21. Jh)" is 1
        if row["Zeitgeschichte (19. bis 21. Jh)"] == "1":
            period.append("contemporary")
        del row["Zeitgeschichte (19. bis 21. Jh)"]
        # add the string "modern" to the list "period" if the field "Neuzeit" is 1
        if row["Neuzeit"] == "1":
            period.append("modern")
        del row["Neuzeit"]
        # add the string "medieval" to the list "period" if the field "Mittelalter" is 1
        if row["Mittelalter"] == "1":
            period.append("medieval")
        del row["Mittelalter"]
        # add the string "ancient" to the list "period" if the field "Antike" is 1
        if row["Antike"] == "1":
            period.append("ancient")
        del row["Antike"]
        # add the string "prehistory" to the list "period" if the field "Ur- und frühgeschichte" is 1
        if row["Ur- und frühgeschichte"] == "1":
            period.append("prehistory")
        del row["Ur- und frühgeschichte"]
        row["period"] = period
        del row["Zur Löschung vorgeschlagen"]

# # make sure all records have the same layout
# for entry in data:
#     if "type" not in entry:
#         entry["type"] = []
#     if "access" not in entry:
#         entry["access"] = []
#     if "period" not in entry:
#         entry["period"] = []


with open('entries.json', 'w') as jsonfile:
    jsonfile.write(json.dumps(data, indent=4))
