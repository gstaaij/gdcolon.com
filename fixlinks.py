#!/usr/bin/env python3

import sys
import os
import shutil

def main():
    filesToFix = ["gdsplitter/style.css", "assets/gdfont/fontgen.css", "gdfont/index.html"]

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
            fileText = fileText.replace("url('https://gdcolon.com/", "url('/")
            fileText = fileText.replace("url(\"https://gdcolon.com/", "url(\"/")
        elif (fileName == "gdfont/index.html"):
            fileText = fileText.replace("./assets", "/assets")
        else:
            fileText = fileText.replace("https://gdcolon.com/", "/")
        
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
