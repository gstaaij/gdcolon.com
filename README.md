
# GDColon.com

This is a backup of a few of the client side tools on [gdcolon.com](https://gdcolon.com).

This backup currently includes:

- [GD Save Explorer](https://gdcolon.com/gdsave/) as of 2024-02-10 (version 9)
- [GD Spritesheet Splitter](https://gdcolon.com/gdsplitter/) as of 2024-02-11 (version 3a)

## Running locally

If you want to run this locally for whatever reason, run the following command:

```console
$ python -m http.server
```

If you want the site to work without internet, you must run the following command once, before running the previous one:

```console
$ python fixlinks.py
```

Please keep in mind that this doesn't replace the links to [gdbrowser.com/iconkit](https://gdbrowser.com/iconkit/) in gdsave yet, because those aren't currently in this repo.

## Disclaimer

All of the files within this repo are (or were) also publicly available on [gdcolon.com](https://gdcolon.com). I just downloaded them and put them here.