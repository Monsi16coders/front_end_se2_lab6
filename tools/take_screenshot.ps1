param(
    [Parameter(Mandatory=$true)]
    [string]$OutFile
)

# Simple full-screen screenshot saver for Windows PowerShell (Primary monitor)
# Usage: .\take_screenshot.ps1 -OutFile frontend_local.png

Add-Type -AssemblyName System.Windows.Forms, System.Drawing
$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)

$fullPath = (Resolve-Path -Path $OutFile).ProviderPath 2>$null
if (-not $fullPath) { $fullPath = (Get-Location).ProviderPath + '\' + $OutFile }

$bitmap.Save($fullPath, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()

Write-Output "Saved screenshot to $fullPath"
