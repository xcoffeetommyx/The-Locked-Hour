$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path $root "the-locked-hour-itch.zip"
$files = @(
    ".nojekyll",
    "index.html",
    "styles.css",
    "script.js",
    "story.js"
)

Push-Location $root
try {
    if (Test-Path -LiteralPath $output) {
        Remove-Item -LiteralPath $output
    }

    Compress-Archive -LiteralPath $files -DestinationPath $output -CompressionLevel Optimal
    Write-Host "Created $output"
}
finally {
    Pop-Location
}
