#!/usr/bin/env python3

import sys
import os
import shutil
import re

def main():
    filesToFix = ["gdsplitter/style.css", "gdsave/style.css", "assets/gdfont/fontgen.css", "gdfont/index.html", "gdsave/index.html", "gdsplitter/index.html", "gdsave/index.js", "gdsave/functions/achievementTable.js", "gdsave/functions/levelTable.js", "gdsave/functions/rewardTable.js"]

    for fileName in filesToFix:
        if (os.path.exists(fileName + ".bak")):
            print(f"{fileName + '.bak'} already exists. Don't run this program twice")
            return 1
        
        # Make a backup of the file
        try:
            os.rename(fileName, fileName + ".bak")
        except OSError as e:
            print(f"Couldn't rename {fileName} to {fileName + '.bak'}.")
            print(f"Exception: {e}")
            return 1
        shutil.copy2(fileName + ".bak", fileName)

        fileText = ""
        try:
            with open(fileName, "r") as file:
                fileText = file.read()
        except IOError as e:
            print(f"Couldn't read {fileName}.")
            print(f"Exception: {e}")
            return 1
        if (fileText == ""):
            return 69
        
        if (fileName.endswith(".css")):
            fileText = fileText.replace("url('https://gdcolon.com/assets/", "url('/assets/")
            fileText = fileText.replace("url(\"https://gdcolon.com/assets/", "url(\"/assets/")

            # Google Fonts
            fileText = fileText.replace("url('https://fonts.googleapis.com/css?family=Lato')", "url('/external/gfonts/lato.css')")
            fileText = fileText.replace("url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap')", "url('/external/gfonts/lato-swap.css')")
        elif (fileName.endswith("index.html")):
            if (fileName == "gdfont/index.html"):
                fileText = fileText.replace("./assets", "/assets")
            
            # Remove Google Tag Manager scripts
            fileText = re.sub(r"<script async src=\"https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=UA-\d{9}-\d\"><\/script>(\n +<script>window\.dataLayer = window\.dataLayer \|\| \[\]; function gtag\(\) \{ dataLayer\.push\(arguments\); \} gtag\('js', new Date\(\)\); gtag\('config', 'UA-\d{9}-\d'\);<\/script>)?", "", fileText);
        elif (fileName.endswith(".js")):
            fileText = fileText.replace("https://gdbrowser.com/iconkit/premade/", "/external/gdbrowser/iconkit/premade/")
            fileText = fileText.replace("https://gdbrowser.com/iconkit/items/", "/external/gdbrowser/iconkit/items/")
            fileText = fileText.replace("https://gdbrowser.com/assets/", "/external/gdbrowser/assets/")
        else:
            print(f"Unhandled file {fileName}")
        
        try:
            with open(fileName, "w") as file:
                file.write(fileText)
        except IOError as e:
            print(f"Couldn't write to {fileName}.")
            print(f"Exception: {e}")
            return 1
        
    return 0
            

if __name__ == "__main__":
    sys.exit(main())
