param (
    [string]$message = "Automated update: Added live database integration and UI fixes"
)

Write-Host "Adding files to git..."
git add .

Write-Host "Committing with message: '$message'"
git commit -m $message

Write-Host "Pushing to GitHub..."
git push origin main

Write-Host "Done!"
