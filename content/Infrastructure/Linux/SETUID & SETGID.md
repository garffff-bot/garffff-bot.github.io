Files with the SUID bit set:

```bash
find / -perm -u=s -type f 2>/dev/null
```

or

```bash
find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null
```

GUID:

```bash
find / -uid 0 -perm -6000 -type f 2>/dev/null
```

Or 
```bash
find / -user root -perm -6000 -exec ls -ldb {} \; 2>/dev/null
```

Search for suitable exploit:

```bash
for i in $(curl -s https://gtfobins.github.io/ | html2text | cut -d" " -f1 | sed '/^[[:space:]]*$/d');do if grep -q "$i" installed_pkgs.list;then echo "Check GTFO for: $i";fi;done
```


