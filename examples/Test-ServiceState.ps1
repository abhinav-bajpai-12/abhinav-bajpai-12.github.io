[CmdletBinding()]
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
}
