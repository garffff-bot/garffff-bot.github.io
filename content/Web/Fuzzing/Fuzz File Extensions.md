Using word list:

```bash
ffuf -w /opt/SecLists/Discovery/Web-Content/web-extensions.txt -u http://94.237.54.231:51800/blog/indexFUZZ
```

Or use file extensions in the command:

```bash
ffuf -w /opt/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt -u http://94.237.54.231:51800/blog/FUZZ -e .php,.html
```

