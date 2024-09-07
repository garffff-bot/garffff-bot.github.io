```bash
sudo mount -t cifs //server_ip/share /mount/point
```

```bash
sudo mount -t cifs //server_ip/share /mount/point -o guest
```

```bash
`sudo mount -t cifs //server_ip/share /mount/point -o username=user,password=pass
```

```bash
sudo mount -t cifs //server_ip/share /mount/point -o credentials=/home/username/.smbcredentials
```

.smbcredentials file:

```bash
nano /home/username/.smbcredentials
username=user 
password=pass
chmod 600 /home/username/.smbcredentials`
```

