#!/usr/bin/env python3

import sys
import requests
import time

# Iconkit

icons = {
    "icon": 0,
    "ship": 1,
    "ball": 0,
    "ufo": 1,
    "wave": 1,
    "robot": 1,
    "spider": 1,
    "swing": 1,
    "jetpack": 1,
}

items = {
    "trail": 1,
    "deathEffect": 1,
}

# Assets
# Fun fact: https://gdcolon.com/assets/ is a directory listing

assets = {
    "deatheffects": 0,
    "trails": 1,
}

difficulties = [
    ["unrated", "auto", "easy", "normal", "hard", "harder", "insane", "demon"],
    ["", "-featured", "-epic"],
    ["-easy", "-medium", "-hard", "-insane", "-extreme"],
]

for diffName in difficulties[0]:
    if (diffName == "demon"):
        for suffix in difficulties[2]:
            difficulties[0].append(diffName + suffix)
        break


MAX_UNSUCCESSFUL_REQUESTS = 2

def main():

    # iconkit/

    # premade
    for iconName in icons.keys():
        unsuccessfulRequests = 0
        i = icons[iconName]
        # Retry once on error, and assume we reached the end if that retry also fails
        while (unsuccessfulRequests < MAX_UNSUCCESSFUL_REQUESTS):
            path = f"iconkit/premade/{iconName}_{i}.png"
            url = f"https://gdbrowser.com/{path}"
            r = requests.get(url, stream=True)
            if (r.status_code == 200):
                with open(path, "wb") as file:
                    for chunk in r:
                        file.write(chunk)
                print(f"Downloaded {path}")
                unsuccessfulRequests = 0
                i += 1
            else:
                unsuccessfulRequests += 1
                if (unsuccessfulRequests < MAX_UNSUCCESSFUL_REQUESTS):
                    print(f"Request failed at {iconName}_{i}.png. Retrying in one second...")
                    time.sleep(1)
                else:
                    print(f"Request failed at {iconName}_{i}.png. Assuming we're done...")
    
    # items
    for itemName in items.keys():
        unsuccessfulRequests = 0
        i = items[itemName]
        # Retry once on error, and assume we reached the end if that retry also fails
        while (unsuccessfulRequests < MAX_UNSUCCESSFUL_REQUESTS):
            path = f"iconkit/items/{itemName}_{i}.png"
            url = f"https://gdbrowser.com/{path}"
            r = requests.get(url, stream=True)
            if (r.status_code == 200):
                with open(path, "wb") as file:
                    for chunk in r:
                        file.write(chunk)
                print(f"Downloaded {path}")
                unsuccessfulRequests = 0
                i += 1
            else:
                unsuccessfulRequests += 1
                if (unsuccessfulRequests < MAX_UNSUCCESSFUL_REQUESTS):
                    print(f"Request failed at {itemName}_{i}.png. Retrying in one second...")
                    time.sleep(1)
                else:
                    print(f"Request failed at {itemName}_{i}.png. Assuming we're done...")

    # assets/

    # deatheffects and trails
    for assetName in assets.keys():
        unsuccessfulRequests = 0
        i = assets[assetName]
        # Retry once on error, and assume we reached the end if that retry also fails
        while (unsuccessfulRequests < MAX_UNSUCCESSFUL_REQUESTS):
            path = f"assets/{assetName}/{i}.png"
            url = f"https://gdbrowser.com/{path}"
            r = requests.get(url, stream=True)
            if (r.status_code == 200):
                with open(path, "wb") as file:
                    for chunk in r:
                        file.write(chunk)
                print(f"Downloaded {path}")
                unsuccessfulRequests = 0
                i += 1
            else:
                unsuccessfulRequests += 1
                if (unsuccessfulRequests < MAX_UNSUCCESSFUL_REQUESTS):
                    print(f"Request failed at {assetName}/{i}.png. Retrying in one second...")
                    time.sleep(1)
                else:
                    print(f"Request failed at {assetName}/{i}.png. Assuming we're done...")
    
    # difficulties
    for diffName in difficulties[0]:
        for i in range(len(difficulties[1])):
            path = f"assets/difficulties/{diffName}{difficulties[1][i]}.png"
            url = f"https://gdbrowser.com/{path}"
            r = requests.get(url, stream=True)
            if (r.status_code == 200):
                with open(path, "wb") as file:
                    for chunk in r:
                        file.write(chunk)
                print(f"Downloaded {path}")
            else:
                print(f"Request failed at {diffName}{i}.png. Retrying in one second...")
                time.sleep(1)

    print("Done!")

    return 0

if __name__ == "__main__":
    sys.exit(main())
