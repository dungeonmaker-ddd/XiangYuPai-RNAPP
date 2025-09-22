# PowerShell script: Generate src directory tree structure
# Usage: .\generate-tree.ps1

# Generate directory tree for src folder without files in the deepest level folders
tree src /A | findstr /v /r /c:"^|   |   |   |   " > temp_tree.txt

# Read the generated file content
$content = Get-Content temp_tree.txt

# Add header information before content
$header = @"
---
alwaysApply: true
---
"@

# Combine header and content
$finalContent = $header + "`r`n" + ($content -join "`r`n")

# Write final file to .cursor/rules/ directory
$finalContent | Out-File -FilePath ".cursor/rules/project.mdc" -Encoding UTF8

# Clean up temporary file
Remove-Item temp_tree.txt

Write-Host "Directory tree has been generated to .cursor/rules/project.mdc file" -ForegroundColor Green
Write-Host "Only showing directory structure without files in deepest level folders" -ForegroundColor Yellow
