### Ffuf

```bash
ffuf -u http://x.x.x.x/FUZZ -w /opt/SecLists/Discovery/Web-Content/big.txt {-e .php,.txt,.htm,.html} {-recursion}
```

### Feroxbuster

```bash
feroxbuster -u http://x.x.x.x -w /opt/SecLists/Discovery/Web-Content/big.txt -x .php,.txt,.htm,.html
```

### Dirsearch

```bash
dirsearch -u http://x.x.x.x
```


