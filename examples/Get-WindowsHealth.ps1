[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

try {
    $os = Get-CimInstance -ClassName Win32_OperatingSystem
    $disks = @(Get-CimInstance -ClassName Win32_LogicalDisk -Filter 'DriveType = 3' |
        Select-Object DeviceID,
            @{ Name = 'SizeGB'; Expression = { [math]::Round($_.Size / 1GB, 2) } },
            @{ Name = 'FreeGB'; Expression = { [math]::Round($_.FreeSpace / 1GB, 2) } })

    [pscustomobject]@{
        CollectedAt = (Get-Date).ToString('o')
        OS = $os.Caption
        UptimeHours = [math]::Round(((Get-Date) - $os.LastBootUpTime).TotalHours, 2)
        TotalMemoryGB = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
        FreeMemoryGB = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
        Disks = $disks
    } | ConvertTo-Json -Depth 4
}
catch {
    throw "Windows health collection failed: $($_.Exception.Message)"
}
