### Using Bitlocker:

Crack password:

```bash
bitlocker2john -i Backup.vhd > bit.txt
john bit.txt --wordlist=rockyou.txt
```
### With Dislocker:

```bash
sudo modprobe nbd max_part=8 sudo qemu-nbd --format=vpc --connect=/dev/nbd0 /path/to/file.vhd
sudo mkdir -p /mnt/bitlocker /mnt/vhd
sudo dislocker -r -V /dev/nbd0p2 -u<RECOVERY_KEY> -- /mnt/bitlocker
sudo mount -o loop /mnt/bitlocker/dislocker-file /mnt/vhd
```
### Unmount

```bash
sudo umount /mnt/vhd
sudo umount /mnt/bitlocker
sudo qemu-nbd --disconnect /dev/nbd0
```
### Without Dislocker:

```bash
sudo modprobe nbd max_part=8
sudo qemu-nbd --format=vpc --connect=/dev/nbd0 /path/to/file.vhd
sudo fdisk -l /dev/nbd0
sudo mount /dev/nbd0p1 /mnt/vhd`
```
### Unmount

```bash
sudo umount /mnt/vhd
sudo qemu-nbd --disconnect /dev/nbd0
```

