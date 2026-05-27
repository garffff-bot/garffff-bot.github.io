Nmap:

```bash
sudo nmap -p 5432 -sV x.x.x.x
```

Connect using no credentials:

```bash
psql -h x.x.x.x -U postgres -d postgres
```

View databases:

```bash
\l
```

Connect to database:

```bash
\c <database_name>
```

View tables:

```bash
\dt
```

View information in a table:

```bash
SELECT * FROM users;
```

