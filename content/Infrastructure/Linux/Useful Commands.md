#### Processors Used By Other Users:

```bash
ps au
```
#### Unmounted File Systems and Additional Drives

```bash
lsblk
```
#### Find Writable Directories

```bash
find / -path /proc -prune -o -type d -perm -o+w 2>/dev/null
```
#### Find Writable Files

```bash
find / -path /proc -prune -o -type f -perm -o+w 2>/dev/null
```
#### Mounted drives and unmounted drives

```bash
cat /etc/fstab
```
#### Mounted File Systems

```bash
df -h
```

#### Unmounted File Systems

```bash
cat /etc/fstab | grep -v "#" | column -t
```

#### All Hidden Files

```bash
find / -type f -name ".*" -exec ls -l {} \; 2>/dev/null | grep <user>
```
#### All Hidden Directories

```bash
find / -type d -name ".*" -ls 2>/dev/null
```
#### Temporary Files

```bash
ls -l /tmp /var/tmp /dev/shm
```
#### Installed Packages

```bash
apt list --installed | tr "/" " " | cut -d" " -f1,3 | sed 's/[0-9]://g'
```
#### Binaries

```bash
 ls -l /bin /usr/bin/ /usr/sbin/
```
#### Configuration Files

```bash
find / -type f \( -name *.conf -o -name *.config \) -exec ls -l {} \; 2>/dev/null
```
#### Scripts

```bash
 find / -type f -name "*.sh" 2>/dev/null | grep -v "src\|snap\|share"
```
#### Word Press Config

```bash
cat wp-config.php | grep 'DB_USER\|DB_PASSWORD'
```
#### Other Configuration Files

```bash
find / ! -path "*/proc/*" -iname "*config*" -type f 2>/dev/null
```

