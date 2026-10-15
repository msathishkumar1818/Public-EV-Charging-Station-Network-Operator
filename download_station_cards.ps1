$stationImages = @(
    @{
        Url = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80"
        Path = "assets\images\sections\station-metro-hub.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1558441719-aa34bbe5f347?auto=format&fit=crop&w=800&q=80"
        Path = "assets\images\sections\station-turnpike-hub.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
        Path = "assets\images\sections\station-westside-hub.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
        Path = "assets\images\sections\station-coastal-hub.jpg"
    }
)

foreach ($item in $stationImages) {
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
