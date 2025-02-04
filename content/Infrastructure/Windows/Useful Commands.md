#### Patches and Updates

cmd:

```cmd-session
wmic qfe
```

Powershell:

```powershell-session
Get-HotFix | ft -AutoSize
```
#### Installed Programs

cmd

```cmd-session
wmic product get name
```

Powershell

```powershell-session
Get-WmiObject -Class Win32_Product |  select Name, Version
```

### TCP/UDP Services

Powershell/cmd

```
netstat -ano
```
#### Logged-In Users

Powershell/cmd

```bash
query user
```
#### Current User Privileges

```bash
whoami /priv
```
#### Current User Group Information

```bash
whoami /groups
```
#### Get All Users
```bash
net user
```

#### Get All Groups

```bash
net localgroup
```

#### Details About a Group

```bash
net localgroup administrators
```

#### Get Password Policy & Other Account Information

```bash
net accounts
```

Task List:

```cmd-session
tasklist /svc
```


