$dashboardImages = @(
    @{
        Url = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80"
        Path = "assets\images\sections\dashboard-hero.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
        Path = "assets\images\sections\dashboard-cta.jpg"
    }
)

foreach ($item in $dashboardImages) {
    if (-not (Test-Path $item.Path)) {
        Write-Host "Downloading $($item.Path)..."
        try {
            Invoke-WebRequest -Uri $item.Url -OutFile $item.Path -UserAgent "Mozilla/5.0"
            Write-Host "Saved $($item.Path)"
        } catch {
            Write-Warning "Failed: $_"
        }
    } else {
        Write-Host "Already exists: $($item.Path)"
    }
}
