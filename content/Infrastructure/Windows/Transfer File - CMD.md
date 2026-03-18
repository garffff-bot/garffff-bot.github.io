#### Curl:

```bash
curl http://x.x.x.x/file.txt -o file.txt
```

#### Certutil:

```bash
certutil.exe -urlcache -f http://x.x.x.x/file.txt file.txt
```

#### Powershell:

```bash
powershell -c wget http://x.x.x.x/file.txt -o file.txt
```
#### SMB:

Server:

```bash
sudo smbserver.py share . -smb2support
```

Client:

```bash
copy \\x.x.x.x\share\file.txt
```