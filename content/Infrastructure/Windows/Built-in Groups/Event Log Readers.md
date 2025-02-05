Member of this group can query Windows events from the command line using `wevtutil` and the `Get-WinEvent`.

Using `Get-WinEvent` requires and administrator to  adjust a registry key. Being a member of the group is not sufficient. ``HKLM\System\CurrentControlSet\Services\Eventlog\Securit`.

```
PS C:\Users\logger> net localgroup "Event Log Readers"
Alias name     Event Log Readers
Comment        Members of this group can read event logs from local machine

Members

-------------------------------------------------------------------------------
logger
The command completed successfully.
```
#### wevtutil

```bash
wevtutil qe Security /rd:true /f:text | Select-String "/user"
```

- `wevtutil` → A built-in Windows command-line tool for managing event logs.
- `qe Security` → Queries (`qe`) the **Security** event log.
- `/rd:true` → Reads the log in **reverse order**, meaning the most recent events are displayed first.
- `/f:text` → Outputs the event log entries in **plain text** format.
#### Get-WinEvent

```bash
Get-WinEvent -LogName security | where { $_.ID -eq 4688 -and $_.Properties[8].Value -like '*/user*'} | Select-Object @{name='CommandLine';expression={ $_.Properties[8].Value }}
```

- **`Get-WinEvent -LogName Security`**
    
    - Retrieves events from the **Security** event log.
- **`where { $_.ID -eq 4688 -and $_.Properties[8].Value -like '*/user*'}`**
    
    - Filters the event logs to include only those with **Event ID 4688**.
    - **Event ID 4688** → "A new process has been created." (This logs when a process starts.)
    - `$_` represents each event.
    - `$.ID -eq 4688` → Ensures only process creation events are considered.
    - `$.Properties[8].Value -like '*/user*'` → Checks if the **9th property** (index 8, since arrays are 0-based) contains `"/user"`. This property likely represents the **command line** argument of the process.
- **`Select-Object @{name='CommandLine';expression={ $_.Properties[8].Value }}`**
    
    - Extracts the **9th property** (command line arguments of the process).
    - Renames it to `"CommandLine"` for better readability.

