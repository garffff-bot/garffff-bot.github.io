Find all txt files:

```bash
find / -type f -name "*.txt" 2>/dev/null
```

Find writable folders/files:

```bash
find . -writeable
```

 Find Writable Directories

```bash
find / -path /proc -prune -o -type d -perm -o+w 2>/dev/null
```

 Find Writable Files:

```bash
find / -path /proc -prune -o -type f -perm -o+w 2>/dev/null
```

