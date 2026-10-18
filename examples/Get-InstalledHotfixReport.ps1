[CmdletBinding()]
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
}
