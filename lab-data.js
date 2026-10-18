const labExamples = {
  health: {
    title: "Windows health report",
    description: "Read-only CIM queries for local OS, uptime, physical memory and fixed disks. Requires Windows and access to the relevant CIM classes.",
    file: "examples/Get-WindowsHealth.ps1",
    code: `[CmdletBinding()]
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
}`,
    output: {
      CollectedAt: "2026-10-18T09:00:00.0000000+00:00",
      OS: "Example Windows Server",
      UptimeHours: 72.5, TotalMemoryGB: 16, FreeMemoryGB: 7.25,
      Disks: [{ DeviceID: "C:", SizeGB: 120, FreeGB: 48.5 }]
    }
  },
  services: {
    title: "Service status check",
    description: "Reports named local services without starting, stopping or changing them. Default: EventLog and Winmgmt. Example usage: .\\Test-ServiceState.ps1 -Name EventLog,Winmgmt. A missing service produces an explicit error.",
    file: "examples/Test-ServiceState.ps1",
    code: `[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string[]]$Name = @('EventLog', 'Winmgmt')
)

$ErrorActionPreference = 'Stop'

try {
    $services = @(foreach ($serviceName in $Name) {
        Get-Service -Name $serviceName |
            Select-Object Name, DisplayName,
                @{ Name = 'Status'; Expression = { $_.Status.ToString() } }
    })
    ConvertTo-Json -InputObject $services -Depth 3
}
catch {
    throw "Service status collection failed: $($_.Exception.Message)"
}`,
    output: [
      { Name: "EventLog", DisplayName: "Windows Event Log", Status: "Running" },
      { Name: "Winmgmt", DisplayName: "Windows Management Instrumentation", Status: "Running" }
    ]
  },
  patches: {
    title: "Installed hotfix report",
    description: "Shows the subset of updates returned by Get-HotFix. It cannot establish missing patches or compliance. Missing installation dates remain null; an empty inventory is reported as Count: 0.",
    file: "examples/Get-InstalledHotfixReport.ps1",
    code: `[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

try {
    # Get-HotFix is a partial update inventory, not a compliance assessment.
    $hotfixes = @(Get-HotFix | Sort-Object InstalledOn -Descending |
        Select-Object HotFixID, Description,
            @{ Name = 'InstalledOn'; Expression = {
                if ($_.InstalledOn) { $_.InstalledOn.ToString('yyyy-MM-dd') }
                else { $null }
            } })
    [pscustomobject]@{
        CollectedAt = (Get-Date).ToString('o')
        Scope = 'Updates reported by Get-HotFix; not all update types are included.'
        Count = $hotfixes.Count
        Hotfixes = $hotfixes
    } | ConvertTo-Json -Depth 4
}
catch {
    throw "Hotfix inventory failed: $($_.Exception.Message)"
}`,
    output: {
      CollectedAt: "2026-10-18T09:00:00.0000000+00:00",
      Scope: "Updates reported by Get-HotFix; not all update types are included.",
      Count: 1,
      Hotfixes: [{ HotFixID: "KB-EXAMPLE", Description: "Illustrative update", InstalledOn: "2026-10-01" }]
    }
  }
};
