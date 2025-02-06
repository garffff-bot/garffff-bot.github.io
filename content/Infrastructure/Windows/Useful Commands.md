Patches and Updates

cmd:

```bash
wmic qfe

wmic qfe get Caption,Description,HotFixID,InstalledOn
```

Powershell:

```bash
Get-HotFix | ft -AutoSize
```

 Installed Programs

cmd

```bash
wmic product get name
```

Powershell

```bash
Get-WmiObject -Class Win32_Product |  select Name, Version
```

 TCP/UDP Services

Powershell/cmd

```bash
netstat -ano
```

Logged-In Users:

Powershell/cmd

```bash
query user
```

 Current User Privileges:

```bash
whoami /priv
```

 Current User Group Information:

```bash
whoami /groups
```

 Get All Users:
 
```bash
net user
```

 Get All Groups:

```bash
net localgroup
```

Details About a Group:

```bash
net localgroup administrators
```

Get Password Policy & Other Account Information:

```bash
net accounts
```

Task List:

```bash
tasklist /svc
```


Find a File:

```bash
where /r C:\ confidential.txt
```

Displays a list of environment variables:

```bash
set
```

Prints out the OS version and revision level

```bash
[System.Environment]::OSVersion.Version`
```

Displays the domain name to which the host belongs (ran from CMD-prompt)

```bash
echo %USERDOMAIN%
```

Prints out the name of the Domain controller the host checks in with (ran from CMD-prompt)

```bash
echo %logonserver%
```

Firewall checks:

```bash
netsh advfirewall show allprofiles
```

Windows Defender Check

CMD:

```bash
sc query windefend
```

Powershell:

```bash
Get-MpComputerStatus
```
#### WMI checks

| **Command**                                                                                   | **Description**                                                                                                      |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `wmic qfe get Caption,Description,HotFixID,InstalledOn`                                       | Prints the patch level and description of the Hotfixes applied                                                       |
| `wmic computersystem get Name,Domain,Manufacturer,Model,Username,Roles /format:List`          | Displays basic host information to include any attributes within the list                                            |
| `wmic process list /format:list`                                                              | A listing of all processes on host                                                                                   |
| `wmic ntdomain list /format:list`                                                             | Displays information about the Domain and Domain Controllers                                                         |
| `wmic useraccount list /format:list`                                                          | Displays information about all local accounts and any domain accounts that have logged into the device               |
| `wmic group list /format:list`                                                                | Information about all local groups                                                                                   |
| `wmic sysaccount list /format:list`                                                           | Dumps information about any system accounts that are being used as service accounts.                                 |
| `wmic ntdomain get Caption,Description,DnsForestName,DomainName,DomainControllerAddress`<br>` | information about the domain and the child domain, and the external forest that our current domain has a trust with. |
- Useful cheat sheet: https://gist.github.com/xorrior/67ee741af08cb1fc86511047550cdaf4

#### Table of Useful Net Commands

| **Command**                                     | **Description**                                                                                                              |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `net accounts`                                  | Information about password requirements                                                                                      |
| `net accounts /domain`                          | Password and lockout policy                                                                                                  |
| `net group /domain`                             | Information about domain groups                                                                                              |
| `net group "Domain Admins" /domain`             | List users with domain admin privileges                                                                                      |
| `net group "domain computers" /domain`          | List of PCs connected to the domain                                                                                          |
| `net group "Domain Controllers" /domain`        | List PC accounts of domains controllers                                                                                      |
| `net group <domain_group_name> /domain`         | User that belongs to the group                                                                                               |
| `net groups /domain`                            | List of domain groups                                                                                                        |
| `net localgroup`                                | All available groups                                                                                                         |
| `net localgroup administrators /domain`         | List users that belong to the administrators group inside the domain (the group `Domain Admins` is included here by default) |
| `net localgroup Administrators`                 | Information about a group (admins)                                                                                           |
| `net localgroup administrators [username] /add` | Add user to administrators                                                                                                   |
| `net share`                                     | Check current shares                                                                                                         |
| `net user <ACCOUNT_NAME> /domain`               | Get information about a user within the domain                                                                               |
| `net user /domain`                              | List all users of the domain                                                                                                 |
| `net user %username%`                           | Information about the current user                                                                                           |
| `net use x: \computer\share`                    | Mount the share locally                                                                                                      |
| `net view`                                      | Get a list of computers                                                                                                      |
| `net view /all /domain[:domainname]`            | Shares on the domains                                                                                                        |
| `net view \computer /ALL`                       | List shares of a computer                                                                                                    |
| `net view /domain`                              | List of PCs of the domain                                                                                                    |
- Use `net1` - can potential avoid defender looking/logging commands

Search for domain contoller:

```bash
dsquery * -filter "(userAccountControl:1.2.840.113556.1.4.803:=8192)" -limit 5 -attr sAMAccountName
```

Search for accounts with PASSWD_NOTREQD:

```bash
dsquery * -filter "(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=2))" -attr distinguishedName sAMAccountName userAccountControl
```

Search for accounts disabled:

```bash
dsquery * -filter "(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=2))" -attr distinguishedName userAccountControl
```


