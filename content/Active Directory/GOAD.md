Install Virtual Box 7.0

```bash
wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo gpg --dearmor -o /usr/share/keyrings/oracle-virtualbox.gpg
wget -q https://www.virtualbox.org/download/oracle_vbox.asc -O- | sudo gpg --dearmor -o /usr/share/keyrings/oracle-virtualbox-old.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/oracle-virtualbox.gpg] https://download.virtualbox.org/virtualbox/debian jammy contrib" | \
  sudo tee /etc/apt/sources.list.d/oracle-virtualbox.list

sudo apt update

sudo apt install -y virtualbox-7.0

VB_VER=$(vboxmanage --version | cut -dr -f1)

wget https://download.virtualbox.org/virtualbox/${VB_VER}/Oracle_VM_VirtualBox_Extension_Pack-${VB_VER}.vbox-extpack

sudo vboxmanage extpack install Oracle_VM_VirtualBox_Extension_Pack-${VB_VER}.vbox-extpack
```

Install Vagrant:

```bash
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install vagrant
```

Dependencies:

```bash
vagrant plugin install vagrant-reload vagrant-vbguest winrm winrm-fs winrm-elevated

sudo apt install git sshpass lftp rsync openssh-client python3-venv
```

Install GOAD:

```bash
git clone https://github.com/Orange-Cyberdefense/GOAD.git  
cd GOAD
./goad.sh -t check -l GOAD -p virtualbox
./goad.sh -t install -l GOAD -p virtualbox
```

VMWare Workstation

```bash
git clone https://github.com/Orange-Cyberdefense/GOAD.git
cd GOAD/
./goad.sh -p vmware
GOAD/vmware/local/192.168.56.X > check
GOAD/vmware/local/192.168.56.X > set_lab GOAD
GOAD/vmware/local/192.168.56.X > set_ip_range 192.168.56
GOAD/vmware/local/192.168.56.X > install
```